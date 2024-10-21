from flask import Blueprint, request, jsonify
from models.likeModel import Like
from models.postModel import Post  
from models.userModel import User  
from models.notificationModel import Notification
from database import db

def create_like_bp(socketio):
    like_bp = Blueprint('like_bp', __name__)

    @like_bp.route('/', methods=['POST'])
    def add_like():
        user_id = request.json.get('user_id')
        post_id = request.json.get('post_id')

        new_like = Like(user_id=user_id, post_id=post_id)
        db.session.add(new_like)
        db.session.commit()

        post = Post.query.get(post_id)
        author_id = post.user_id if post else None
        post_content = post.content if post else None
        liker = User.query.get(user_id)

        socketio.emit('new_notification', {
            'message': f'{liker.name} likedaaaaa your post!',
            'author_id': author_id,
            'post_id': post_id,
            'username': liker.name,
            'post_content': post_content
        })

        new_notification = Notification(
            user_id=user_id,
            post_id=post_id,
            is_read=False
        )
        db.session.add(new_notification)
        db.session.commit()

        return jsonify({
            'message': 'Like added successfully',
            'like_id': new_like.id,
            'author_id': author_id,
            'post_content': post_content,
            'liker_id': user_id,
            'liker_name': liker.name
        }), 201

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

    return like_bp
