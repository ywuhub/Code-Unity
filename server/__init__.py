from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from server.database import init_db
from server.endpoints import register_endpoints
from server.managers.project_manager import ProjectManager
from server.managers.user_manager import UserManager
from server.managers.notification_manager import NotificationManager

# create and configure the app
app = Flask(__name__)
CORS(app, supports_credentials=True)
jwt = JWTManager(app)
db = init_db()

notification_manager = NotificationManager(db)
user_manager = UserManager(app, db, jwt, notification_manager)
project_manager = ProjectManager(app, db, notification_manager)

api = register_endpoints(app, db, user_manager, project_manager)

app.config.from_mapping(
    SECRET_KEY=b"\xb6\x07\x03a[(\xaaj\x13'\xc8X\xd5%}\x9f",
    JWT_SECRET_KEY=b"\xf8u4\x0f\xfc\xa2\x06\xc5v\xf3\xa1\xfal{\x95\xb8",
    JWT_BLACKLIST_ENABLED=True,
    JWT_BLACKLIST_TOKEN_CHECKS=["access", "refresh"],
    # Access tokens to expire in 1 day
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(1, 0, 0),
)


import server.routes
