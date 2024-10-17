from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from database import db
from models.userModel import User
from models.postModel import Post
from models.commentModel import Comment
from routes.userRoutes import user_bp
from routes.postRoutes import post_bp
from routes.likeRoutes import like_bp
from routes.commentRoutes import comment_bp

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///social_network.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key_here'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_NAME'] = 'session'
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(post_bp, url_prefix='/post')
app.register_blueprint(like_bp, url_prefix='/like')
app.register_blueprint(comment_bp, url_prefix='/comment')

@app.route('/')
def welcome():
    return jsonify(message="Welcome to the Social Network API!")

if __name__ == '__main__':
    app.run(debug=True, port=3001)