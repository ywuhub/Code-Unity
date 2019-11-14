from flask_restful import Resource, reqparse
from pymongo.database import Database

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


class ResetPassword(Resource):
    #def __init__(self, db: Database):
    #    print("TEST")
    #    self.users = db.get_collection("users")

    def get(self):
        # fetch the email parameter
        get_parser = reqparse.RequestParser(bundle_errors=True)
        get_parser.add_argument("email", type=str, required=True, help="Email required")
        email_arg = get_parser.parse_args(strict=True)

        print(email_arg)
