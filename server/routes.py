"""
This file provides routing for static and server generated files.
"""
from server import app


@app.route("/", methods=["GET"])
def index():
    return "index.html!"
