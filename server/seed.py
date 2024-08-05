#!/usr/bin/env python3

#Standard library imports
from random import choice as rc

#Remote library imports
from faker import Faker

#Local imports
from app import app
from models import db, User, Task, Comment

fake = Faker()

def create_users(n=10):
    users = []
    for _ in range(n):
        user = User(
            username=fake.user_name(),
            email=fake.email(),
            password=fake.password()  # Note: Ensure this matches your hashing mechanism if you have one
        )
        users.append(user)
        db.session.add(user)
    db.session.commit()
    return users

def create_tasks(users, n=20):
    tasks = []
    task_titles = [
        "Complete project proposal", "Update website", "Prepare presentation",
        "Research market trends", "Plan team meeting", "Review budget",
        "Develop new feature", "Fix bugs", "Test new release", "Conduct training session"
    ]
    for _ in range(n):
        task = Task(
            title=rc(task_titles),
            description=fake.paragraph(nb_sentences=3),
            due_date=fake.future_date(end_date="+30d"),
            priority=rc(['low', 'medium', 'high']),
            status=rc(['pending', 'in_progress', 'completed']),
            user_id=rc(users).id
        )
        tasks.append(task)
        db.session.add(task)
    db.session.commit()
    return tasks

def create_comments(users, tasks, n=50):
    for _ in range(n):
        comment = Comment(
            content=fake.sentence(nb_words=10),
            task_id=rc(tasks).id,
            user_id=rc(users).id
        )
        db.session.add(comment)
    db.session.commit()

if __name__ == 'main':
    with app.app_context():
        print("Starting seed...")

    # Drop all tables and recreate them
    db.drop_all()
    db.create_all()

    # Create seed data
    users = create_users(n=10)
    tasks = create_tasks(users, n=20)
    create_comments(users, tasks, n=50)

    print("Seeding complete!")