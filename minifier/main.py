import json
import sys
from getopt import getopt

from minify import Minifier

def help():
    print "How to run:"
    print "python minify 'filepath' [options]"
    print "Options:"
    print "-s or --statistics Show the minify statistics"
    print "-c or --config (file) Use a config file in json format"
    print "-h or --help Show this help"

if __name__ == "__main__":

    useStastistics = False
    config = None

    try:
        opts, args = getopt(sys.argv[2:], "x", ["help", "statistics", "config="])

    except:
        help()
        sys.exit()

    for opt, arg in opts:
        if opt in ("-h", "--help"):
            help()
            sys.exit()

        elif opt in ("-s", "--statistics"):
            useStastistics = True

        elif opt in ("-c", "--config"):
            jsonFile = open(arg)

            try:
                config = json.load(jsonFile)

            except ValueError:
                print "File isn't in a valid json format"
                sys.exit()

            jsonFile.close()

    mini = Minifier(sys.argv[1], config["build"], useStastistics)
    mini.execute()