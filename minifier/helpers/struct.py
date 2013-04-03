import json

class Struct(object):
    def __init__(self, d): 
        for i, attr in d.iteritems():
            if isinstance(attr, (list, tuple)):
               setattr(self, i, [Struct(value) if isinstance(value, dict) else value for value in attr])
            else:
               setattr(self, i, Struct(attr) if isinstance(attr, dict) else attr)

    def __str__(self):
        return json.dumps(self.__dict__, sort_keys=True, indent=4)