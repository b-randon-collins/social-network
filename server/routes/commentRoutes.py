from flask import Blueprint, request, jsonify, session
from models.commentModel import db, Comment
from models.postModel import Post
from models.userModel import User

comment_bp = Blueprint('comment', __name__)

def is_authenticated():
    if 'user_id' in session:
        return True
    return False

@comment_bp.route('/<int:post_id>', methods=['GET'])
def get_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).all()
    comment_list = [{
        'id': comment.id,
        'content': comment.content,
        'user_id': comment.user_id,
        'name': comment.author.name,
        'created_at': comment.created_at
    } for comment in comments]
    
    return jsonify(comments=comment_list), 200

@comment_bp.route('/', methods=['OPTIONS', 'POST'])
def create_comment():
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200

    data = request.get_json()
    post_id = data.get('post_id')
    content = data.get('content')
    user_id = session.get('user_id')

    if not post_id or not content:
        return jsonify(message="Missing fields"), 400

    comment = Comment(content=content, post_id=post_id, user_id=user_id)
    db.session.add(comment)
    db.session.commit()

    return jsonify({
        'id': comment.id,
        'content': comment.content,
        'user_id': comment.user_id,
        'name': comment.author.name,
        'created_at': comment.created_at,
        'post_id': post_id
    }), 201


