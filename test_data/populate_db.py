import csv
from argon2 import PasswordHasher
from pymongo import MongoClient

ph = PasswordHasher(time_cost=1, memory_cost=51200, parallelism=2)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~#
# code to populate database #
#~~~~~~~~~~~~~~~~~~~~~~~~~~~#

# connect to the MongoDB account (mlab)
credientials = open('db_credentials.txt', 'r') # external file storing the credentials
conn_url = credientials.readline().rstrip()    # get the database connection url
client = MongoClient(conn_url)                 # connect to the database remotely
db = client['code-unity-database']             # selecting the database

# read csv files
user_ids = {}
csv_files = ['test_data/users.csv', 'test_data/profiles.csv']
for csv_file in csv_files:
    with open(csv_file, mode='r', encoding='utf-8-sig') as f_csv:
        reader = csv.reader(f_csv)
        header = next(reader)
        
        # populate users collection
        if csv_file == 'test_data/users.csv':
            for row in reader:
                # fetch the column values for each row
                username = row[0]
                password = ph.hash(row[1])
                email = row[2]
                avatar = row[3]

                # document to insert into collection
                doc = {
                    header[0]: username,
                    header[1]: password,
                    header[2]: email,
                    header[3]: avatar
                }
        
                # insert into database
                collection = db['users']
                _id = collection.insert_one(doc)

                # preseve _id for the profiles collection
                user_ids[email] = _id.inserted_id
        
        if csv_file == 'test_data/profiles.csv':
            for row in reader:
                # fetch the column values for each row
                name = row[0].strip()
                email = row[1]
                visibility = row[2]
                description = row[3]
                interests = row[4]
                programming_languages = row[5]
                languages = row[6]
                github = row[7]

                # format csv list into python lists and remove any whitespaces
                interests = interests.split(',')
                interests = [interest.strip() for interest in interests]
                
                programming_languages = programming_languages.split(',')
                programming_languages = [prog_lang.strip() for prog_lang in programming_languages]

                languages = languages.split(',')
                languages = [language.strip() for language in languages]
                
                # document to insert into collection
                doc = {
                    "_id": user_ids[email],
                    header[0]: name,
                    header[1]: email,
                    header[2]: visibility, 
                    header[3]: description,
                    header[4]: interests,
                    header[5]: programming_languages,
                    header[6]: languages,
                    header[7]: github
                }
                
                # insert into database
                collection = db['profiles']
                collection.insert_one(doc)


                


