from datetime import datetime
from models.postModel import db, Post
from models.userModel import db, User

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)  # Correct table name
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Match 'users' table
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    author = db.relationship('User', backref=db.backref('comments', lazy=True))
    post = db.relationship('Post', backref=db.backref('comments', lazy=True))
