from flask_restful import Resource
from server import db


class CourseList(Resource):
    def get(self):
        """
        Lists all the COMP courses available in UNSW.
        ```json
        [
            {
                "code": string,
                "name": string,
            }
        ]
        ```

        Example:
        ```
        GET ->
        (200 OK) <-
            [
                {
                    "code": "COMP1000",
                    "name": "Introduction to World Wide Web, Spreadsheets and Databases"
                },
                {
                    "code": "COMP1400",
                    "name": "Programming for Designers"
                }
            ]
        ```
        """
        # ret should be cached if endpoint is too slow
        ret = []
        for doc in db["comp_courses"].find({}).sort("code", 1):
            ret.append({"code": doc["code"], "name": doc["name"]})
        return ret
