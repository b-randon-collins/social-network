from flask import Blueprint, request, jsonify
from models.postModel import db, Post
from models.userModel import db, User

post_bp = Blueprint('post', __name__)

@post_bp.route('/create', methods=['POST'])
def create_post():
    data = request.get_json()
    
    if not data:
        print("No data provided in the request.")
        return jsonify(message="No data provided"), 400
    
    content = data.get('content')
    user_id = data.get('user_id')

    if not content or not user_id:
        print("Missing fields:", {"content": content, "user_id": user_id})
        return jsonify(message="Missing fields in request"), 400

    user = User.query.get(user_id)
    if not user:
        print("User not found:", user_id)
        return jsonify(message="User not found"), 404

    post = Post(content=content, user_id=user_id)
    db.session.add(post)
    db.session.commit()

    print("Post created successfully:", post.id)
    return jsonify(message="Post created successfully!", post_id=post.id), 201
