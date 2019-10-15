#!/usr/bin/env python

"""
dbupdater.py: Scrapes all UNSW COMP courses and populates the data into a MongoDB database (mlab)
NOTES:
- Collections are the tables in SQL
- Inserting a document is same as inserting a row in SQL
- Example of a document { 'key 1' : value 1, 
                          'key 2' : value 2,
                          'key 3' : value 3 } 
  -> SQL version would be |key 1|key 2|key 3| (columns) and |value 1|value 2|value 3| (a row)
"""

# import statements
from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient
import urllib.request
import re

# add courses to database (checks if course already exists first)
# input parameters:
# - document: A row of data that contains the Course Code and Course Name
def add_course(document):
    if collection.count_documents(document, limit = 1) == 0:
        collection.insert_one(document)
    else:
        print(document['code'] + ":", "Already exists in database!")

# scrape all COMP courses and any additional useful data
# input parameters:
# - base_url: The url to scrap the COMP courses (i.e. UNSW Timetable for COMP)
def scrape_courses(base_url):
    try:
        webpage = urllib.request.urlopen(base_url) # connect to UNSW website for COMP timetables
    except:
        print('Error! URL is invalid.')

    soup = BeautifulSoup(webpage, 'html.parser')
    tables = soup.find_all('table') # get the table of elements that contains the 
                                    # code for the comp courses along with the course name
    for table in [tables[8], tables[11]]:
        # tables[8] = Undergraduate Courses, tables[11] = Postgraduate Courses 
        # get the course code and name elements from the table
        tr = table.find_all('a', href=re.compile(r'[A-Z]{4}[0-9]{4}\.html'))
        
        for i in range(0, len(tr), 2): # fetch pairwise items (course_code, course_name)
            course_code = tr[i].text 
            course_name = tr[i+1].text
            doc = { 'code': course_code, 
                    'name': course_name }
            add_course(doc) # add document to collection (if it does not exist)

# DEBUGGING ONLY
def display_db():
    # fetch all documents in the collection
    cursor = collection.find({}).sort("code", 1) # sorted in ascending order of course codes

    # display each document
    for doc in cursor:
        print(doc['code'] + ":", doc['name'])

if __name__ == "__main__":
    # connect to the MongoDB account (mlab)
    credientials = open('db_credentials.txt', 'r') # external file storing the credentials
    conn_url = credientials.readline().rstrip()    # get the database connection url
    client = MongoClient(conn_url)                 # connect to the database remotely
    db = client['code-unity-database']             # selecting the database
    collection = db['comp_courses']                # getting the right collection (if it doesn't exist, it will create it) 
                                                   # to store the documents
    # scrape the COMP courses from UNSW timetable in the current year
    curr_year = datetime.now().year
    courses_url = "http://timetable.unsw.edu.au/" + str(curr_year) + "/COMPKENS.html"
    #scrape_courses(courses_url) # comment this out if DEBUGGING below

    # DEBUGGING ONLY (Displays all COMP courses in the database - comment out the other functions called above)
    display_db()
                 
