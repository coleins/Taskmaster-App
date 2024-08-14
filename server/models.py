from datetime import datetime
import re
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, DateTime
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin

# Set up SQLAlchemy with metadata naming convention
metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

# Initialize SQLAlchemy
db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)
    tasks = db.relationship(
        'Task', backref='user', lazy=True, cascade='all, delete-orphan'
    )
    created_at = db.Column(DateTime, server_default=db.func.now())
    updated_at = db.Column(DateTime, onupdate=db.func.now())
    comments = db.relationship(
        'Comment', backref='user', lazy=True, cascade='all, delete-orphan'
    )
    dashboards = db.relationship(
        'Dashboard', backref='owner', lazy=True, cascade='all, delete-orphan'
    )
    assigned_tasks = db.relationship('Task', secondary='task_assignees', backref='assignees')

    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email address")
        return email

    @validates('username')
    def validate_username(self, key, username):
        if len(username) < 3 or len(username) > 20:
            raise ValueError("Username must be between 3 and 20 characters")
        if not re.match(r"^\w+$", username):
            raise ValueError("Username must contain only letters, numbers, and underscores")
        existing_user = db.session.query(User).filter_by(username=username).first()
        if existing_user:
            raise ValueError("Username already exists")
        return username

    def _repr_(self):
        return f"<User {self.username}>"

class Dashboard(db.Model, SerializerMixin):
    __tablename__ = 'dashboards'
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(150), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tasks = db.relationship(
        'Task', backref='dashboard', lazy=True, cascade='all, delete-orphan'
    )

    @validates('project_name')
    def validate_project_name(self, key, project_name):
        if not project_name:
            raise ValueError("Project name is required")
        return project_name

    def _repr_(self):
        return f"<Dashboard {self.project_name}>"

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    priority = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(50), nullable=True, default='pending')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    dashboard_id = db.Column(db.Integer, db.ForeignKey('dashboards.id'), nullable=False)
    created_at = db.Column(DateTime, server_default=db.func.now())
    updated_at = db.Column(DateTime, onupdate=db.func.now())
    comments = db.relationship('Comment', backref='task', lazy=True, cascade='all, delete-orphan')
    
    # Serialize assignees
    assignees = db.relationship('User', secondary='task_assignees', backref='tasks')
    serialize_rules = ('-assignees.password',)  # Exclude sensitive data like passwords

    @validates('title')
    def validate_title(self, key, title):
        if not title:
            raise ValueError("Title is required")
        return title

    @validates('priority')
    def validate_priority(self, key, priority):
        if priority not in ['high', 'medium', 'low']:
            raise ValueError("Invalid priority")
        return priority

    @validates('status')
    def validate_status(self, key, status):
        if status not in ['pending', 'in_progress', 'completed']:
            raise ValueError("Invalid status")
        return status

    def _repr_(self):
        return f"<Task {self.title}>"


class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(DateTime, server_default=db.func.now())
    updated_at = db.Column(DateTime, onupdate=db.func.now())

    @validates('content')
    def validate_content(self, key, content):
        if not content:
            raise ValueError("Content is required")
        return content

    def _repr_(self):
        return f"<Comment {self.content[:20]}>"

# Association table for task assignees
task_assignees = db.Table('task_assignees',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)