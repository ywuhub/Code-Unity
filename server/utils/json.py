from flask_restful import fields


class ObjectId(fields.Raw):
    """
    Unmarshalling helper class for bson.ObjecId
    """

    def format(self, value):
        return str(value)
