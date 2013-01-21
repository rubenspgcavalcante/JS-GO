#!/usr/bin/env python
#
# Script to minify the jsgo.js
# Using the Closure Compiler API
# See more in https://developers.google.com/closure/compiler/docs/api-ref
#
# author: Rubens Pinheiro Goncalves Cavalcante
# email: rubenspgcavalcante@gmail.com
#

import urllib
import httplib
import json
import sys

def loadFile(filePath):
    codeFile = open(filePath, "r")
    content = codeFile.read()
    codeFile.close()
    return content


def responseParser(response):
    response = json.loads(response)
    return response


def showErrors(errors):
    if "serverErrors" in errors:
        print "Some server errors ocurred:"
        for serverError in errors["serverErrors"]:
            print "\terror code: " + str(serverError["code"])
            print "\tmessage:    " + str(serverError["error"]) + "\n"

    elif "errors" in errors:
        print "Some errors ocurred:\n"
        errorNumber = 1

        for error in errors["errors"]:
            print "Error number " + str(errorNumber)
            errorNumber += 1

            print "\tmessage:  " + str(error["error"])
            print '\tline:     "' + str(error["line"]) +'"'
            print "\tline num: " + str(error["lineno"])
            print "\ttype:     " + str(error["type"])
            print "\n"


def showStatistics(statistics):
    print "Some statistics:"
    statistics = statistics["statistics"]

    print "\toriginal size:     " + str(statistics["originalSize"]) + " bytes"
    print "\tcompressed size:   " + str(statistics["compressedSize"]) + " bytes"
    print "\tgziped size:       " + str(statistics["originalGzipSize"]) + " bytes"
    print "\tgziped compressed: " + str(statistics["compressedGzipSize"]) + " bytes"
    print "\tcompile time:      " + str(statistics["compileTime"]) + " seconds \n"


def closureCompilerCall(filePath, outputInfo):
    print "Making request " + outputInfo + "...",
    sys.stdout.flush()
    
    content = loadFile(filePath)
    params = {\
        "js_code": content, \
        "compilation_level": "SIMPLE_OPTIMIZATIONS",\
        "output_format": "json",\
        "output_info": outputInfo,\
    }

    post = urllib.urlencode(params)
    headers = { "Content-type": "application/x-www-form-urlencoded" }
    conn = httplib.HTTPConnection('closure-compiler.appspot.com')

    conn.request('POST', '/compile', post, headers)
    response = conn.getresponse()
    
    print "...done!"
    return response.read()


def minify(giveStatistics):
    minFile = open("jsgo.min.js", "w")
    response = responseParser(closureCompilerCall("jsgo.js", "compiled_code"))

    if "compiledCode" not in response or response["compiledCode"] == "":
        errors = responseParser(closureCompilerCall("jsgo.js", "errors"))
        showErrors(errors)
    
    else:
        if giveStatistics == True:
            statistics = errors = responseParser(closureCompilerCall("jsgo.js", "statistics"))
            showStatistics(statistics)

        minFile.write(response["compiledCode"])


if __name__ == "__main__":
    if "--help" in sys.argv:
        print "How to run:"
        print "python minify [--statistics]"

    elif "--statistics" in sys.argv:
        minify(True)

    else:
        minify(False)