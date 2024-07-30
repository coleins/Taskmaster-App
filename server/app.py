from flask import Flask
from flask_migrate import Migrate
from db import db  # Importing from the separate db module
from models import User, Task, Comment  # Import models to register them

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# Define a simple route
@app.route('/')
def home():
    return "Hello, Flask is running!"

if __name__ == '__main__':
    app.run(port=5555, debug=True)
