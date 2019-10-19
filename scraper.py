#!/usr/bin/env python

"""
dbupdater.py: Scrapes all UNSW COMP courses and populates the data into a MongoDB database (mlab)
              Scrapes all the programming languages (on wiki) and puts it in to the database
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

# add document to database (checks if document already exists first)
# input parameters:
# - document: A row of data
# - collection_name: The collection where the row of data is to be stored
def add_doc(document, collection_name):
    collection = db[collection_name] # getting the right collection (if it doesn't exist, it will create it) 
                                     # to store the documents
    if collection.count_documents(document, limit = 1) == 0:
        collection.insert_one(document)
    else:
        print("Document already exists in database!")

# scrape all COMP courses and any additional useful data
# input parameters:
# - base_url: The url to scrape the COMP courses (i.e. UNSW Timetable for COMP)
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
            add_doc(doc, 'comp_courses') # add document to collection (if it does not exist)

# get the list of all the programming languages in Wikipedia
# input parameters:
# - base_url: The url to scrape the list of programming languages
def scrape_prog(base_url):
    try:
        webpage = urllib.request.urlopen(base_url) # connect to Wikipedia page for the programming languages list
    except:
        print('Error! URL is invalid.')

    # fetch all the lists in the html code and find the ones with the programming languages
    soup = BeautifulSoup(webpage, 'html.parser')
    lists = soup.find_all('ul')

    # lists of all the programming languages [A to Z] are the lists[5],...,lists[31]
    # each lists has bullet points of programming languages
    for prog_list in lists[5:32]: 
        bullet_pts = prog_list.find_all('li')
        for bullet in bullet_pts:
            prog_lang = str(bullet.text).strip().rstrip() # programming language from the list
            doc = { 'name': prog_lang }
            add_doc(doc, 'prog_langs') # add document to collection (if it does not exist)

# DEBUGGING ONLY: Print the first five rows of data from each collection
def display_db():
    # fetch the first five documents in the collections
    collections = db.list_collection_names()
    for collection_name in collections:
        if collection_name not in ['objectlabs-system.admin.collections', 'objectlabs-system', 'system.indexes']: # ignore system collections
            print("COLLECTION NAME:", collection_name)
            collection = db[collection_name]
            for doc in collection.find({}, {'_id': 0}).limit(5): # print all keys except the '_id' key
                print(doc)
            print("")

if __name__ == "__main__":
    # connect to the MongoDB account (mlab)
    credientials = open('db_credentials.txt', 'r') # external file storing the credentials
    conn_url = credientials.readline().rstrip()    # get the database connection url
    client = MongoClient(conn_url)                 # connect to the database remotely
    db = client['code-unity-database']             # selecting the database
                                                   
    # scrape the COMP courses from UNSW timetable in the current year
    curr_year = datetime.now().year
    courses_url = "http://timetable.unsw.edu.au/" + str(curr_year) + "/COMPKENS.html"
    #scrape_courses(courses_url) # comment this out if DEBUGGING below

    # scrape all the programming laguages list from Wikipedia
    prog_list_url = "https://en.wikipedia.org/wiki/List_of_programming_languages"
    #scrape_prog(prog_list_url) # comment this out if DEBUGGING below     
    
    # DEBUGGING ONLY: Print first five rows of data from each collection
    display_db()