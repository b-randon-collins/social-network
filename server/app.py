# app.py

from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from database import db
from flask_socketio import SocketIO
from routes.userRoutes import create_user_bp
from routes.likeRoutes import create_like_bp
from routes.postRoutes import post_bp
from routes.commentRoutes import comment_bp
from routes.notificationRoutes import notification_bp

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5173"]}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///social_network.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key_here'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_NAME'] = 'session'

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(create_user_bp(socketio), url_prefix='/user')
app.register_blueprint(post_bp, url_prefix='/post')
app.register_blueprint(create_like_bp(socketio), url_prefix='/like')
app.register_blueprint(comment_bp, url_prefix='/comment')
app.register_blueprint(notification_bp, url_prefix='/notifications')

@app.route('/')
def welcome():
    return jsonify(message="Welcome to the Social Network API!")

@app.route('/emit')
def emit_event():
    socketio.emit('new_notification', {'data': 'Hello from emit!'}, namespace='/')
    return jsonify(message="Event emitted!")

if __name__ == '__main__':
    socketio.run(app, debug=True, port=3001)
