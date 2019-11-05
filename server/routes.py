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