"""
This file provides routing for static and server generated files.
"""
from server import app, db
from flask import render_template, request
from pymongo.database import Database


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template('index.html')

@app.route("/project", methods=["GET", "POST"])
def new_project():
    #db = Database.get_collection("projects")
    return render_template('new_project.html')

@app.route("/profile/<user_id>", methods=["GET"])
def user_profile(user_id):
    if db['profiles'].count_documents({'_id': user_id}, limit = 1) == 0:
        return render_template('404.html')
    else:
        return render_template('profile.html')