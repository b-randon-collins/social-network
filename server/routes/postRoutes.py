from flask import Blueprint, request, jsonify
from models.postModel import db, Post
from models.userModel import db, User

post_bp = Blueprint('post', __name__)

@post_bp.route('/', methods=['POST'])
def create_post():
    data = request.get_json()
    
    if not data:
        return jsonify(message="No data provided"), 400
    
    content = data.get('content')
    user_id = data.get('user_id')

    if not content or not user_id:
        return jsonify(message="Missing fields"), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404

    post = Post(content=content, user_id=user_id)
    db.session.add(post)
    db.session.commit()

    return jsonify({
        'id': post.id,
        'content': post.content,
        'user_id': post.user_id,
        'name': user.name,
        'created_at': post.created_at
    }), 201

@post_bp.route('/', methods=['GET'])
def get_all_posts():
    posts = Post.query.all()
    all_posts = [
        {
            'id': post.id,
            'content': post.content,
            'user_id': post.user_id,
            'name': post.author.name,
            'created_at': post.created_at
        } for post in posts
    ]
    return jsonify(all_posts=all_posts), 200
