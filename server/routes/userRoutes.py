from flask import Blueprint, request, jsonify
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
        return jsonify(message="Login successful!"), 200
    return jsonify(message="Invalid email or password."), 401
