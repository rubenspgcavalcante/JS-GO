import json
from helpers.struct import Struct
from helpers.singleton import singleton

@singleton
class Config(object):
    def __init__(self):
        self._config = None


    def register(self, fileName):
        configFile = open(fileName)
        self.config = None

        try:
            self._config = json.load(configFile)
            self._config = Struct(self._config)

        except ValueError:
            return False

        configFile.close()
        return True

    def get(self):
        return self._config