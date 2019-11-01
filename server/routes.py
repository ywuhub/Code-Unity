"""
This file provides routing for static and server generated files.
"""
import json

from bson.json_util import dumps
from bson.objectid import ObjectId
from flask import render_template, send_from_directory, send_file

from server import app, db


@app.route("/")
@app.route("/login")
def index():
    return send_from_directory("static", "index.html")


@app.route("/main.js")
def mainjs():
    return send_from_directory("static", "main.js")


@app.route("/api/list/languages")
def language_list():
    return send_file("data/languages.json")


@app.route("/api/list/technologies")
def tech_list():
    return send_file("data/technologies.json")


@app.route("/project", methods=["GET", "POST"])
def new_project():
    # db = Database.get_collection("projects")
    return render_template("new_project.html")

@app.route("/user/project/<user_id>", methods=["GET"])
def user_projects(user_id):
    user_db = db.get_collection("profiles")
    profile_db = db.get_collection("projects")
    name = user_db.find_one({"_id": ObjectId(user_id)}, {"_id": 0, "name": 1})
    projects = profile_db.find({"members": {"$eq": ObjectId(user_id)}})
    data = {
        "name" : name['name'],
        "projects": projects
    }
    return json.loads(dumps(data))

@app.route("/profile/<user_id>", methods=["GET"])
def user_profile(user_id):
    try:
        # check if user exists - if not then return 404 error, else continue to fetch user details
        if db["profiles"].count_documents({"_id": ObjectId(user_id)}, limit=1) == 0:
            return (
                render_template("404.html"),
                404,
            )  # we will need a better 404 error page
        else:
            data = db["profiles"].find_one(
                {"_id": ObjectId(user_id)}
            )  # get the user's profile information
            json_data = json.loads(dumps(data))
            return json_data, 200
    except:
        # goes here if user_id is not a valid ObjectId object
        return render_template("404.html"), 404  # we will need a better 404 error page
