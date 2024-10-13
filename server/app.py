from flask import Flask, jsonify
from flask_migrate import Migrate
from database import db, bcrypt
from routes.userRoutes import user_bp

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///social_network.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key_here'

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(user_bp, url_prefix='/api/user')

@app.route('/')
def welcome():
    return jsonify(message="Welcome to the Social Network API!")

if __name__ == '__main__':
    app.run(debug=True, port=3001)
