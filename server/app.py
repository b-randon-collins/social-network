from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from database import db
from models.userModel import User
from models.postModel import Post
from routes.userRoutes import user_bp
from routes.postRoutes import post_bp

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///social_network.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key_here'

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(post_bp, url_prefix='/post')

@app.route('/')
def welcome():
    return jsonify(message="Welcome to the Social Network API!")

if __name__ == '__main__':
    app.run(debug=True, port=3001)