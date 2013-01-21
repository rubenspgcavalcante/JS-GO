import urllib
import httplib
import json


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
    for error in errors["errors"]:
        print "\toriginal size:   " + str(error["originalSize"])
        print "\tcompressed size: " + str(error["compressedSize"])
        print "\tcompile time:    " + str(error["compileTime"]) + "\n"


def closureCompilerCall(filePath, outputInfo):
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

    return response.read()


def minify():
    minFile = open("jsgo.min.js", "w")
    response = responseParser(closureCompilerCall("jsgo.js", "compiled_code"))

    if "compiledCode" not in response or response["compiledCode"] == "":
        errors = responseParser(closureCompilerCall("jsgo.js", "errors"))
        showErrors(errors)
    
    else:
        statistics = errors = responseParser(closureCompilerCall("jsgo.js", "statistics"))
        showStatistics(statistics)
        minFile.write(response["compiledCode"])


minify()