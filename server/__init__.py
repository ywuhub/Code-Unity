import os

from flask import Flask
from flask_restful import Api

# create and configure the app
app = Flask(__name__)
api = Api(app)
app.config.from_mapping(SECRET_KEY="dev")

import server.routes
import server.endpoints
