import random
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import timedelta, datetime
from flask_cors import CORS
from models import db, User, Task, Comment, Dashboard
import logging
from flask_restful import Api
from dotenv import load_dotenv
from flask_mail import Mail, Message

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 1)))
app.json.compact = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# Email configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')



# Initialize extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)
mail = Mail(app)

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

# Set debug mode from environment variable
app.debug = bool(os.getenv("FLASK_DEBUG", 0))

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
        return jsonify({
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "created_at": current_user.created_at,
            "updated_at": current_user.updated_at
        })
    return jsonify({"message": "User not found"}), 404

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user": new_user.id}), 201


@app.route('/users', methods=['GET'])
def list_users():
    users = User.query.all()
    users_data = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
    return jsonify(users_data)

@app.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        })
    return jsonify({"message": "User not found"}), 404


@app.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = bcrypt.generate_password_hash(data['password']).decode("utf-8")
        
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})
@app.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200



# Dashboard Management
@app.route("/dashboards", methods=["GET"])
@jwt_required()
def list_user_dashboards():
    user_id = get_jwt_identity()
    dashboards = Dashboard.query.filter_by(user_id=user_id).all()
    dashboard_data = [{'id': dashboard.id, 'project_name': dashboard.project_name} for dashboard in dashboards]
    return jsonify(dashboard_data), 200

@app.route("/dashboards", methods=["POST"])
@jwt_required()
def create_dashboard():
    data = request.get_json()
    project_name = data.get("project_name")
    user_id = get_jwt_identity()

    new_dashboard = Dashboard(
        project_name=project_name,
        user_id=user_id
    )
    db.session.add(new_dashboard)
    db.session.commit()

    return jsonify({"message": "Dashboard created successfully", "dashboard": new_dashboard.id}), 201


@app.route('/tasks/<int:id>', methods=['PATCH'])
@jwt_required()
def update_task(id):
    task = Task.query.get_or_404(id)
    data = request.get_json()
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    db.session.commit()
    return jsonify({"message": "Task updated successfully"}), 200


@app.route("/dashboards/<int:dashboard_id>", methods=["GET"])
@jwt_required()
def get_dashboard(dashboard_id):
    dashboard = Dashboard.query.get(dashboard_id)
    if dashboard:
        return jsonify({
            "id": dashboard.id,
            "project_name": dashboard.project_name,
            "user_id": dashboard.user_id
        })
    return jsonify({"message": "Dashboard not found"}), 404

@app.route("/dashboards/<int:dashboard_id>", methods=["PUT"])
@jwt_required()
def update_dashboard(dashboard_id):
    data = request.get_json()
    dashboard = Dashboard.query.get(dashboard_id)

    if not dashboard:
        return jsonify({"message": "Dashboard not found"}), 404

    dashboard.project_name = data.get("project_name", dashboard.project_name)

    db.session.commit()

    return jsonify({"message": "Dashboard updated successfully"}), 200

@app.route("/dashboards/<int:dashboard_id>", methods=["DELETE"])
@jwt_required()
def delete_dashboard(dashboard_id):
    dashboard = Dashboard.query.get(dashboard_id)
    if not dashboard:
        return jsonify({"message": "Dashboard not found"}), 404

    db.session.delete(dashboard)
    db.session.commit()

    return jsonify({"message": "Dashboard deleted successfully"}), 200



# Task Management

@app.route('/recent-tasks', methods=['GET'])
@jwt_required()
def get_recent_tasks():
    user_id = get_jwt_identity()
    recent_tasks = Task.query.filter_by(user_id=user_id).order_by(Task.created_at.desc()).limit(5).all()
    return jsonify([{
        'name': task.title,
        'dashboard': task.dashboard.project_name  # Assuming Task model has a relationship with Dashboard
    } for task in recent_tasks])


@app.route("/tasks/stats", methods=["GET"])
@jwt_required()
def get_task_stats():
    user_id = get_jwt_identity()
    view = request.args.get("view", "daily")  # Default to 'daily'

    now = datetime.now()
    start_date, end_date = None, None

    if view == "daily":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(days=1)
    elif view == "weekly":
        start_date = now - timedelta(days=now.weekday())
        end_date = start_date + timedelta(weeks=1)
    elif view == "monthly":
        start_date = now.replace(day=1)
        end_date = (start_date + timedelta(days=31)).replace(day=1)
    else:
        return jsonify({"message": "Invalid view parameter"}), 400

    tasks = Task.query.filter_by(user_id=user_id).filter(Task.created_at.between(start_date, end_date)).all()

    stats = {
        "completed": sum(1 for task in tasks if task.status == "completed"),
        "inProgress": sum(1 for task in tasks if task.status == "in_progress"),
        "pending": sum(1 for task in tasks if task.status == "pending")
    }

    return jsonify(stats), 200


@app.route("/dashboards/<int:dashboard_id>/tasks", methods=["GET"])
@jwt_required()
def get_tasks(dashboard_id):
    tasks = Task.query.filter_by(dashboard_id=dashboard_id).all()
    return jsonify([{
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "due_date": task.due_date,
        "priority": task.priority,
        "status": task.status,
        "user_id": task.user_id,
        "dashboard_id": task.dashboard_id
    } for task in tasks])

@app.route("/tasks/<int:task_id>/invite", methods=["POST"])
@jwt_required()
def invite_user_to_task(task_id):
    data = request.get_json()
    email = data.get("email")
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"message": "Task not found"}), 404

    # Send email logic here
    msg = Message(
        subject="You have been invited to a task",
        sender="taskmaster200@outlook.com",
        recipients=[email],
        body=f"You have been invited to work on the task: {task.title}.\n\nDescription: {task.description}\nDue Date: {task.due_date}"
    )
    mail.send(msg)

    return jsonify({"message": f"Invitation sent to {email}"}), 200



@app.route("/tasks/<int:dashboard_id>", methods=["POST"])
@jwt_required()
def create_task(dashboard_id):
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    due_date_str = data.get("due_date")
    priority = data.get("priority")
    status = data.get("status", "pending")
    assignee_ids = data.get("assignee_ids", [])

    # Convert due_date from string to datetime object
    try:
        due_date = datetime.fromisoformat(due_date_str)
    except ValueError:
        return jsonify({"message": "Invalid date format. Use ISO 8601 format."}), 400

    # Create new task
    new_task = Task(
        title=title,
        description=description,
        due_date=due_date,
        priority=priority,
        status=status,
        dashboard_id=dashboard_id,
        user_id=get_jwt_identity()  # Set creator as the current user
    )
    db.session.add(new_task)
    
    # Assign users to the task
    for user_id in assignee_ids:
        user = User.query.get(user_id)
        if user:
            new_task.assignees.append(user)
    
    db.session.commit()

    return jsonify({"message": "Task created successfully", "task": new_task.id}), 201


@app.route("/tasks/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id):
    task = Task.query.get(task_id)
    if task:
        return jsonify({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date,
            "priority": task.priority,
            "status": task.status,
            "user_id": task.user_id,
            "dashboard_id": task.dashboard_id
        })
    return jsonify({"message": "Task not found"}), 404

@app.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"message": "Task not found"}), 404

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.due_date = data.get("due_date", task.due_date)
    task.priority = data.get("priority", task.priority)
    task.status = data.get("status", task.status)
    task.dashboard_id = data.get("dashboard_id", task.dashboard_id)

    db.session.commit()

    return jsonify({"message": "Task updated successfully"}), 200

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully"}), 200

@app.route("/tasks/<int:task_id>/assign", methods=["POST"])
@jwt_required()
def assign_user_to_task(task_id):
    data = request.get_json()
    user_id = data.get("user_id")
    task = Task.query.get(task_id)
    user = User.query.get(user_id)

    if not task or not user:
        return jsonify({"message": "Task or User not found"}), 404

    task.assignees.append(user)
    db.session.commit()

    return jsonify({"message": "User assigned to task successfully"}), 200

# Comment Management
@app.route("/comments/<int:task_id>", methods=["POST"])
@jwt_required()
def create_comment(task_id):
    data = request.get_json()
    content = data.get("content")
    user_id = get_jwt_identity()

    new_comment = Comment(
        content=content,
        task_id=task_id,
        user_id=user_id
    )
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({"message": "Comment created successfully", "comment": new_comment.id}), 201


@app.route("/comments/<int:comment_id>", methods=["GET"])
@jwt_required()
def get_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if comment:
        return jsonify({
            "id": comment.id,
            "content": comment.content,
            "timestamp": comment.timestamp,
            "task_id": comment.task_id,
            "user_id": comment.user_id
        })
    return jsonify({"message": "Comment not found"}), 404

@app.route("/comments/<int:comment_id>", methods=["PUT"])
@jwt_required()
def update_comment(comment_id):
    data = request.get_json()
    comment = Comment.query.get(comment_id)

    if not comment:
        return jsonify({"message": "Comment not found"}), 404

    comment.content = data.get("content", comment.content)

    db.session.commit()

    return jsonify({"message": "Comment updated successfully"}), 200

@app.route("/comments/<int:comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"message": "Comment not found"}), 404

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"message": "Comment deleted successfully"}), 200

# Timer Management
@app.route('/timer-sound')
@jwt_required()
def timer_sound():
    return send_from_directory('public', 'beep_sound.mp3')

# Notification Management
@app.route('/check-tasks-due', methods=['GET'])
@jwt_required()
def check_tasks_due():
    now = datetime.utcnow()
    one_hour_from_now = now + timedelta(hours=1)
    
    tasks_due = Task.query.filter(Task.due_date <= one_hour_from_now, Task.due_date > now).all()
    
    notifications = []
    for task in tasks_due:
        project_name = task.project.name  # Assuming task has a project relationship
        task_name = task.title
        message = f"Dear user, the project {project_name} has a task {task_name} due in 1 hour."
        notifications.append(message)
    
    return jsonify(notifications)
@app.route('/')
def index():
    return "<h2>Hello, Flask is running!</h2>"



if __name__ == "__main__":
    app.run(port=5555, debug=False)