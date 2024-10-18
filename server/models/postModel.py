from database import db

class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Define the relationship with Notification
    notifications = db.relationship('Notification', back_populates='post')

    def __repr__(self):
        return f"<Post {self.id}, User ID: {self.user_id}, Content: {self.content}>"
