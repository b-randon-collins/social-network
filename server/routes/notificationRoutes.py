# notificationRoutes.py

from flask import Blueprint, jsonify, session
from models.notificationModel import db, Notification
from models.postModel import db, Post

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/all', methods=['GET'])
def get_all_notifications():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401

    notifications = (
        Notification.query
        .join(Post, Notification.post_id == Post.id)
        .filter(Post.user_id == user_id) 
        .order_by(Notification.created_at.desc())
        .all()
    )

    result = [{
        'id': n.id,
        'post_id': n.post_id,
        'created_at': n.created_at,
        'is_read': n.is_read,
        'post_content': n.post.content,
        'username': n.user.name if n.user else 'Unknown User',
    } for n in notifications]
    
    print(result) 
    return jsonify(result), 200

@notification_bp.route('/recent', methods=['GET'])
def get_recent_notifications():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401

    notifications = (
        Notification.query
        .join(Post, Notification.post_id == Post.id)
        .filter(Post.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(4)
        .all()
    )

    return jsonify([{
        'id': n.id,
        'post_id': n.post_id,
        'created_at': n.created_at,
        'is_read': n.is_read,
        'username': n.user.name if n.user else 'Unknown User',
        'post_content': n.post.content  # Include the post content in the response
    } for n in notifications]), 200


@notification_bp.route('/read/<int:notification_id>', methods=['PUT'])
def mark_as_read(notification_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401
    
    notification = Notification.query.get(notification_id)
    if notification and notification.user_id == user_id:
        notification.is_read = True
        db.session.commit()
        return jsonify({'message': 'Notification marked as read'}), 200
    return jsonify({'message': 'Notification not found'}), 404

@notification_bp.route('/clear', methods=['DELETE'])
def clear_notifications():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401

    Notification.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({'message': 'All notifications cleared'}), 200

def emit_new_notification(user_id, post_id):
    socketio.emit('new_notification', {'user_id': user_id, 'post_id': post_id})
