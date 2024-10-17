from flask import Blueprint, request, jsonify, session
from models.postModel import db, Post
from models.userModel import db, User
from models.likeModel import db, Like
from models.commentModel import db, Comment

post_bp = Blueprint('post', __name__)

def is_authenticated():
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
    user_id = session.get('user_id')
    posts = Post.query.order_by(Post.created_at.desc()).all()  
    all_posts = []
    first_comments = []
    recent_comments = {}

    for post in posts:
        likes = Like.query.filter_by(post_id=post.id).all()
        likes_count = len(likes)
        logged_user_liked = any(like.user_id == user_id for like in likes) if user_id else False

        comment_count = Comment.query.filter_by(post_id=post.id).count()

        first_comment = Comment.query.filter_by(post_id=post.id).order_by(Comment.created_at).first()
        if first_comment:
            first_comments.append({
                'id': first_comment.id,
                'content': first_comment.content,
                'post_id': first_comment.post_id,
                'user_id': first_comment.user_id,
                'name': first_comment.author.name,
                'created_at': first_comment.created_at
            })

        most_recent_user_comment = Comment.query.filter_by(post_id=post.id, user_id=user_id).order_by(Comment.created_at.desc()).first() if user_id else None
        
        if most_recent_user_comment:
            recent_comments[post.id] = {
                'id': most_recent_user_comment.id,
                'content': most_recent_user_comment.content,
                'created_at': most_recent_user_comment.created_at,
                'name': most_recent_user_comment.author.name,
                'post_id': most_recent_user_comment.post_id,
                'user_id': most_recent_user_comment.user_id
            }

        all_posts.append({
            'id': post.id,
            'content': post.content,
            'user_id': post.user_id,
            'name': post.author.name,
            'created_at': post.created_at,
            'likes_count': likes_count,
            'logged_user_liked': logged_user_liked,
            'comment_count': comment_count,
        })

    return jsonify({
        'posts': all_posts,
        'comments': first_comments,
        'recent_comments': recent_comments,
    }), 200

