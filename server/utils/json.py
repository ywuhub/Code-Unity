from flask_restful import fields

from collections import OrderedDict


class ObjectId(fields.Raw):
    """
    Unmarshalling helper class for bson.ObjecId
    """

    def format(self, value):
        return str(value)


def marshal(data, fields, envelope=None):
    """
    Custom marshaller that ignores fields with None values.
    """

    def make(cls, k, data):
        if isinstance(cls, type):
            return cls().output(k, data)
        return cls.output(k, data)

    if isinstance(data, (list, tuple)):
        return (
            OrderedDict([(envelope, [marshal(d, fields) for d in data])])
            if envelope
            else [marshal(d, fields) for d in data]
        )

    items = OrderedDict()

    for k, v in fields.items():
        if isinstance(v, dict):
            items[k] = marshal(data, v)
        else:
            d = make(v, k, data)
            if d is None:
                continue
            items[k] = d

    return OrderedDict([(envelope, items)]) if envelope else items
