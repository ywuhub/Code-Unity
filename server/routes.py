"""
This file provides routing for static and server generated files.
"""
from server import app, db
from flask import render_template, request
from pymongo.database import Database
from bson.objectid import ObjectId


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template('index.html')

@app.route("/project", methods=["GET", "POST"])
def new_project():
    #db = Database.get_collection("projects")
    return render_template('new_project.html')

@app.route("/profile/<user_id>", methods=["GET"])
def user_profile(user_id):
    if db['profiles'].count_documents({"_id": ObjectId(user_id)}, limit = 1) == 0: # check if user exists
        return render_template('404.html') # return 404 error if user does not exists
                                           # WE HAVE TO PLACE THIS LATER (need to return error)
    else:
        data = db['profiles'].find_one({"_id": ObjectId(user_id)}) # get the user's profile information
        return render_template('profile.html', profile = data) # WE HAVE TO PLACE THIS LATER (need to return json data)
        