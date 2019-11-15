from json import dumps

from flask_restful import Resource, reqparse
from pymongo.database import Database

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


class ResetPassword(Resource):
    def __init__(self, db: Database):
        self.users = db.get_collection("users")

    def get(self):
        """
        Sends a message to reset user's password to a registered email address if they forgot their password.
        INPUT:
        - email: a email that is linked to a code unity account or else error will be sent back

        EXAMPLE:
        ```
        GET ?email=test@example.com ->
            (200 OK) <-
                Message sent to registered email address if found to reset password
        ```
        """

        # fetch the email parameter
        get_parser = reqparse.RequestParser(bundle_errors=True)
        get_parser.add_argument("email", type=str, required=True, help="Email required")
        email_arg = get_parser.parse_args(strict=True)
        
        # check if email in database or else send error
        doc = self.users.find_one({"email": email_arg['email']})
        if doc:
            # create message to send 
            content = r"""
                        <p>Hello {username},<p>
                        <p>
                            This email is to confirm your request to reset your password for your Code Unity account.
                            To access your account, you will now need to follow the instructions below:
                        </p>
                        <ol>
                            <li>Click on the following link to go to the password reset page. Link: <link to reset password goes here></li>
                            <li>On the page fill in your new password and click on 'Save Changes'.</li>
                            <li>Wait 5 seconds for you to be redirected back to the login page to use new password.</li>
                        </ol>
                        <p>Best Regards,<br>
                           Code Unity
                        </p>
                       """.format(username = doc['username'])

            message = Mail(
                from_email = 'admin@codeunity.com',
                to_emails = doc['email'],
                subject = 'Code Unity: Password Reset Information',
                html_content = content
            )

            # send message through sendgrid api
            try: 
                send_msg = SendGridAPIClient('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')
                send_msg.send(message)
            except Exception:
                return {"message": "An error has occured! Please try again."}
        else:
            return {"message": "Error: Email is not registered to an Code Unity account. Please try again!"}

        return {"message": "An email has been sent to your email address " + email_arg['email'] + ". " +
                           "Follow the instructions given in that email to reset your password."}