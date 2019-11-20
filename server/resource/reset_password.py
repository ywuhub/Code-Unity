from argon2 import PasswordHasher
from bson import ObjectId

from flask import current_app
from flask_restful import Resource, reqparse
from pymongo.database import Database

from itsdangerous import TimedJSONWebSignatureSerializer as Serializer


# password hasher to encode incoming user passwords for resetting password
ph = PasswordHasher(time_cost=1, memory_cost=51200, parallelism=2)

def verify_token(user_token: str):
    s = Serializer(current_app.config['SECRET_KEY'])

    # decodes the token to get the user_id that is embedded to it
    # i.e. {'_id': user_id}.tokenkey
    # decoding gives: payload = {'_id': user_id} [tokenkey removed]
    try:
        payload = s.loads(user_token)
    except:
        return {"message" : "Reset Password Token has expired or is invalid. Please resend reset password request again!"}

    return payload

class ResetPassword(Resource):
    def __init__(self, db: Database):
        self.users = db.get_collection("users")

    def put(self, token: str):
        """
        Reset the password from the link sent to the user's email which goes here
        and we verify the timed token to see if it has expired.
        INPUT:
        - token: token key with the user id embedded with a 24 hour life

        EXAMPLE:
        ```
        PUT api/reset_password/token-key?password=example ->
            (200 OK) <-
                "message": "Password has been reset! Redirecting your to the login page in 5 seconds..."
        ```
        """
        # decode token to get user id to reset password
        payload = verify_token(token)
        
        # return error if invalid token
        if '_id' in payload.keys():
            user_id = payload['_id']
        else:
            return payload, 400

        # fetch password parameter
        put_parser = reqparse.RequestParser(bundle_errors=True)
        put_parser.add_argument("password", type=str, required=True, help="New Password required")
        args = put_parser.parse_args(strict=True)
        
        # check if password is valid
        if args['password'] == '':
            return {"message": "Please enter a valid password"}, 400

        # update password in database
        doc = self.users.find_one({"_id": ObjectId(user_id)})
        if doc:
            password = ph.hash(args['password'])
            self.users.update({"_id": ObjectId(user_id)}, {"$set": {"password": password}}, upsert=False)
        else:
            return {"message" : "Error: Invalid Token. Please resend reset password request again!"}, 400

        return {"message": "Password has been reset! Redirecting your to the login page in 5 seconds..."}