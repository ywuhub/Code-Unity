import os

from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from server.utils import init_db

# create and configure the app
app = Flask(__name__)
api = Api(app)
CORS(app)
jwt = JWTManager(app)
db = init_db()

app.config.from_mapping(
    SECRET_KEY=b"\xb6\x07\x03a[(\xaaj\x13'\xc8X\xd5%}\x9f",
    JWT_SECRET_KEY=b"\xf8u4\x0f\xfc\xa2\x06\xc5v\xf3\xa1\xfal{\x95\xb8",
)

import server.routes
import server.endpoints
