from flask import Blueprint, request, jsonify, session, make_response
from models.userModel import db, User

user_bp = Blueprint('user', __name__)

@user_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data:
        print("No data provided in the request.")
        return jsonify(message="No data provided"), 400
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        print("Missing fields:", {"name": name, "email": email, "password": password})
        return jsonify(message="Missing fields in request"), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        print("User with this email already exists:", email)
        return jsonify(message="User with this email already exists"), 400

    user = User(name=name, email=email)
    user.password = password
    db.session.add(user)
    db.session.commit()

    print("Signup successful for user:", name)
    return jsonify(message="Signup successful!")

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify(message="Email and password are required."), 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        session['user_id'] = user.id
        response = jsonify(message="Login successful!")
        response.set_cookie('user_id', str(user.id), httponly=False, samesite='Lax')
       
        return response, 200
    
    response.set_cookie('user_id', str(user.id), httponly=False)

    return jsonify(message="Invalid email or password."), 401


@user_bp.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    response = jsonify(message="Logout successful!")
    response.set_cookie('user_id', '', expires=0)
    return response, 204

@user_bp.route('/current_user', methods=['GET'])
def current_user():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify(user={'id': user.id, 'name': user.name, 'email': user.email}), 200
    return jsonify(message="No user is logged in."), 401
