"""
This file provides routing for static and server generated files.
"""
from flask import send_file

from server import app


@app.route("/")
@app.route("/CreateGroup")
@app.route("/favourites")
@app.route("/groupchat")
@app.route("/groupList")
@app.route("/inbox")
@app.route("/login")
@app.route("/mygroup")
@app.route("/profile")
def index():
    return send_file("static/index.html")


@app.route("/main.js")
def mainjs():
    return send_file("static/main.js")


@app.route("/api/list/languages")
def language_list():
    return send_file("data/languages.json")


@app.route("/api/list/technologies")
def tech_list():
    return send_file("data/technologies.json")
