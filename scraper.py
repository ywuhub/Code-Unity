#!/usr/bin/env python

"""
dbupdater.py: Scrapes all UNSW COMP courses and populates the data into a MongoDB database (mlab)
NOTE:
- Collections are the tables in SQL
- Inserting a document is same as inserting a row in SQL
"""

# import statements
from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient

# scrape all COMP courses and any additional useful data (if any)
def scrape_courses(base_url):
    return base_url

if __name__ == "__main__":
    # connect to the MongoDB account (mlab)
    credientials = open('db_credentials.txt', 'r') # external file storing the credentials
    conn_url = credientials.readline().rstrip()    # get the database connection url
    client = MongoClient(conn_url)                 # connect to the database remotely
    db = client['code-unity-database']             # selecting the desired database
    collection = db['comp_courses']                # making a new collection to store the documents

    # scrape the COMP courses from unsw timetable in the current year
    curr_year = datetime.now().year
    courses_url = "http://timetable.unsw.edu.au/" + str(curr_year) + "/COMPKENS.html"
    print(scrape_courses(courses_url))
                 
