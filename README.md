# COMP4920 Project: Code Unity

## Deploying
`heroku-cli` required.

```bash
heroku login
heroku git:remote -a code-unity
git push heroku master
# If deploying from non-master branch "testbranch"
# git push heroku testbranch:master
```

## Background
Many COMP courses often require students to form a team as part of their project assessment which is used to strengthen their teamwork and apply their knowledge learnt. However, the degree of difficulty to locate the perfect set of teammates for the set task is often time consuming and difficult if the pool of candidates is confined to the individual’s tutorial group or if all of them in the course are strangers. Impromptu creations of these groups are often chaotic and the compatibility of the team is often left to luck. Additionally, there isn’t any platform for UNSW students to get together and create something as a team which would be both useful as a extra-curricular experience, something interesting to show on their github/resume, and as a way to forge friendships by working together on a project.

## Project Aim
Our project aims to solve the problems outlined in the background by providing an online platform on which UNSW students will be able to find other students to work on projects with. To that end, our app will provide these key services:
- Creating a listing: Users will be able to post a listing to our platform with their project title and other information relevant to their project such as what kind of fields their projects are related to, the technologies and languages involved, what course it’s meant to be for i.e. COMP4920, and the kind of people they’d like for the project.
- List/search listings: Users will be able to list or search through the listings by their title/description or filter and sort them by other criteria.
- Apply for listings: Users will be able to apply for listings they’re interested in and be able to state what skills they are able to bring to the project and other relevant information. The creator of the listing will then be notified of the application.
