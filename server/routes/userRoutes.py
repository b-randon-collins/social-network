from flask import Blueprint, request, jsonify, session
from models.userModel import db, User
from flask_socketio import emit, join_room  # Ensure join_room is imported

active_users = {}

def create_user_bp(socketio):
    user_bp = Blueprint('user', __name__)

    @user_bp.route('/login', methods=['POST'])
    def login():
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify(message="Email and password are required."), 400

        user = User.query.filter_by(email=email).first()
        if user:
            if user.check_password(password):
                session['user_id'] = user.id
                response = jsonify(id=user.id, name=user.name, email=user.email)

                socketio.emit('join', {'userId': user.id}, room=user.id)
                active_users[user.id] = user.name
                print(f"User {user.name} (ID: {user.id}) logged in.")
                print("Current Active Users:")
                for uid, name in active_users.items():
                    print(f"- {name} (ID: {uid}) in room {uid}")

                return response, 200
        return jsonify(message="Invalid email or password."), 401

    @user_bp.route('/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        
        if not data:
            return jsonify(message="No data provided"), 400
        
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify(message="Missing fields in request"), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify(message="User with this email already exists"), 400

        user = User(name=name, email=email)
        user.password = password
        db.session.add(user)
        db.session.commit()

        return jsonify(message="Signup successful!")


    @user_bp.route('/edit', methods=['PATCH'])
    def edit_user():
        data = request.get_json()
        
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
        user_id = session.pop('user_id', None)
        if user_id:
            user = User.query.get(user_id)
            if user:
                if user_id in active_users:
                    del active_users[user_id]
                print(f"User {user.name} (ID: {user.id}) logged out.")
                print("Current Active Users:")
                if active_users:
                    for uid, name in active_users.items():
                        print(f"- {name} (ID: {uid}) in room {uid}")
                else:
                    print("No users are currently logged in.")
        
        response = jsonify(message="Logout successful!")
        response.set_cookie('user_id', '', expires=0)
        return response, 204

    return user_bp
