"""
This file provides routing for static and server generated files.
"""
from server import app
from flask import render_template, request
from pymongo.database import Database


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template('index.html')

@app.route("/project", methods=["GET", "POST"])
def new_project():
    #db = Database.get_collection("projects")
    return render_template('new_project.html')
