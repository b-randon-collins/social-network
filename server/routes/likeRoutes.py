# likeRoutes.py

from flask import Blueprint, request, jsonify
from models.likeModel import Like
from database import db

like_bp = Blueprint('like_bp', __name__)

@like_bp.route('/', methods=['POST'])
def add_like():
    user_id = request.json.get('user_id')
    post_id = request.json.get('post_id')
    new_like = Like(user_id=user_id, post_id=post_id)
    
    db.session.add(new_like)
    db.session.commit()
    
    return jsonify({'message': 'Like added successfully', 'like_id': new_like.id}), 201

@like_bp.route('/<int:post_id>', methods=['GET'])
def get_likes(post_id):
    likes = Like.query.filter_by(post_id=post_id).all()
    return jsonify({'likes_count': len(likes)})

@like_bp.route('/<int:post_id>', methods=['DELETE'])
def remove_like(post_id):
    user_id = request.json.get('user_id')
    like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    
    if not like:
        return jsonify(message="Like not found"), 404
    
    db.session.delete(like)
    db.session.commit()
    
    return jsonify(message="Like removed successfully"), 200
