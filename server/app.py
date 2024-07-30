import random
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import timedelta
from flask_cors import CORS
from models import db, User, Task, Comment
import logging

app = Flask(__name__)
CORS(app)

# Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"  # Updated database name
app.config["JWT_SECRET_KEY"] = "fsbdgfnhgvjnvhmvh" + str(random.randint(1, 1000000000000))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
app.config["SECRET_KEY"] = "JKSRVHJVFBSRDFV" + str(random.randint(1, 1000000000000))

# Initialize extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
db.init_app(app)

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO)

@app.before_request
def log_request_info():
    logging.info(f"Request: {request.method} {request.url}")

@app.after_request
def log_response_info(response):
    logging.info(f"Response: {response.status} {response.get_data()}")
    return response

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"message": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({"message": "Internal server error"}), 500

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"message": "Bad request"}), 400

# JWT Blacklist
BLACKLIST = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

# User Management
@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token})

    return jsonify({"message": "Invalid email or password"}), 401

@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"success": "Successfully logged out"}), 200

@app.route("/current_user", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user:
        return jsonify({"id": current_user.id, "username": current_user.username, "email": current_user.email}), 200
    return jsonify({"error": "User not found"}), 404

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=bcrypt.generate_password_hash(data['password']).decode("utf-8")
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': 'User created successfully'}), 201

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email})

@app.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    user.username = data['username']
    user.email = data['email']
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@app.route('/users', methods=['GET'])
def list_users():
    users = User.query.all()
    users_data = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
    return jsonify(users_data)

# Task Management
@app.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_task = Task(
        title=data['title'],
        description=data['description'],
        due_date=data.get('due_date'),
        priority=data.get('priority'),
        status=data.get('status', 'pending'),
        user_id=current_user_id
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created successfully'}), 201

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date,
        'priority': task.priority,
        'status': task.status,
        'user_id': task.user_id
    })

@app.route('/tasks', methods=['GET'])
def get_tasks():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    tasks = Task.query.paginate(page=page, per_page=per_page)
    tasks_data = []
    for task in tasks.items:
        tasks_data.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date,
            'priority': task.priority,
            'status': task.status,
            'user_id': task.user_id
        })
    return jsonify({
        'tasks': tasks_data,
        'total': tasks.total,
        'pages': tasks.pages,
        'current_page': tasks.page
    })

@app.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    task.title = data['title']
    task.description = data.get('description')
    task.due_date = data.get('due_date')
    task.priority = data.get('priority')
    task.status = data.get('status', task.status)
    db.session.commit()
    return jsonify({'message': 'Task updated successfully'})

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'})

# Define a simple route
@app.route('/')
def home():
    return "Hello, Flask is running!"

if __name__ == "__main__":
    app.run(port=5555, debug=True)
