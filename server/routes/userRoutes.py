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
    print("Login request data:", data)

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        print("Email or password missing.")
        return jsonify(message="Email and password are required."), 400

    user = User.query.filter_by(email=email).first()
    if user:
        print(f"User found: {user.id} - {user.name}")
        if user.check_password(password):
            session['user_id'] = user.id
            print(f"Session set: {session}")
            response = jsonify(id=user.id, name=user.name, email=user.email)
            print("Login successful:", response.get_json())
            return response, 200
        else:
            print("Invalid password for user:", user.id)
    else:
        print("User not found with email:", email)

    return jsonify(message="Invalid email or password."), 401

@user_bp.route('/edit', methods=['PATCH'])
def edit_user():
    data = request.get_json()
    
    if not data:
        return jsonify(message="No data provided"), 400

    user_id = session.get('user_id')
    if not user_id:
        return jsonify(message="User not logged in."), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found."), 404

    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'bio' in data:
        user.bio = data['bio']

    db.session.commit()
    return jsonify(message="User updated successfully!", user={"name": user.name, "email": user.email, "bio": user.bio})

@user_bp.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    response = jsonify(message="Logout successful!")
    response.set_cookie('user_id', '', expires=0)
    return response, 204


