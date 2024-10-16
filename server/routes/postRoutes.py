from flask import Blueprint, request, jsonify, session
from models.postModel import db, Post
from models.userModel import db, User
from models.likeModel import db, Like


post_bp = Blueprint('post', __name__)

def is_authenticated():
    print(f"Session Data: {session}") 
    if 'user_id' in session:
        return True
    return False
@post_bp.route('/', methods=['POST'])
def create_post():
    if not is_authenticated():
        return jsonify(message="Unauthorized"), 401

    data = request.get_json()
    
    if not data:
        return jsonify(message="No data provided"), 400
    
    content = data.get('content')
    user_id = session.get('user_id')

    if not content or not user_id:
        return jsonify(message="Missing fields"), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404

    post = Post(content=content, user_id=user_id)
    db.session.add(post)
    db.session.commit()

    likes_count = 0
    logged_user_liked = False

    return jsonify({
        'id': post.id,
        'content': post.content,
        'user_id': post.user_id,
        'name': user.name,
        'created_at': post.created_at,
        'likes_count': likes_count,
        'logged_user_liked': logged_user_liked
    }), 201


@post_bp.route('/', methods=['GET'])
def get_all_posts():
    if not is_authenticated():
        return jsonify(message="Unauthorized"), 401

    user_id = session.get('user_id')
    posts = Post.query.all()
    all_posts = []
    
    for post in posts:
        likes = Like.query.filter_by(post_id=post.id).all()
        likes_count = len(likes)
        
        logged_user_liked = any(like.user_id == user_id for like in likes) if user_id else False

        all_posts.append({
            'id': post.id,
            'content': post.content,
            'user_id': post.user_id,
            'name': post.author.name,
            'created_at': post.created_at,
            'likes_count': likes_count,
            'logged_user_liked': logged_user_liked
        })
        
    print(f"Fetched posts with user_id {user_id}: {all_posts}")

    return jsonify(all_posts=all_posts), 200
