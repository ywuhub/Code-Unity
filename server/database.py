from pymongo import MongoClient
from pymongo.database import Database


def init_db() -> Database:
    credentials = open("db_credentials.txt", "r")
    conn_url = credentials.readline().rstrip()
    # Our deployment on mLab does not support retryable writes.
    client = MongoClient(conn_url, retryWrites=False)
    return client.get_database("code-unity-database")
