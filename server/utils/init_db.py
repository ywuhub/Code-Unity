from pymongo import MongoClient
from pymongo.database import Database


def init_db() -> Database:
    credentials = open("db_credentials.txt", "r")
    conn_url = credentials.readline().rstrip()
    client = MongoClient(conn_url)
    return client.get_database("code-unity-database")
