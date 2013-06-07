#!/usr/bin/env python
# -*- coding: utf8 -*- 

# Script to minify the jsgo.js
# Using the Closure Compiler API
# See more in https://developers.google.com/closure/compiler/docs/api-ref
#
# author: Rubens Pinheiro Goncalves Cavalcante
# email: rubenspgcavalcante@gmail.com

import urllib
import httplib
import sys
import json

from datetime import datetime

from config import Config

class Minifier:

    def __init__(self, filePath, giveStatistics):
        self.filePath = filePath
        self.config = Config().get()
        self.giveStatistics = giveStatistics

    def loadFile(self, filePath):
        codeFile = open(filePath, "r")
        content = codeFile.read()
        codeFile.close()
        return content


    def responseParser(self, response):
        response = json.loads(response)
        return response


    def showErrors(self, errors):
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


    def showStatistics(self, statistics):
        print "Some statistics:"
        statistics = statistics["statistics"]

        print "\toriginal size:     " + str(statistics["originalSize"]) + " bytes"
        print "\tcompressed size:   " + str(statistics["compressedSize"]) + " bytes"
        print "\tgziped size:       " + str(statistics["originalGzipSize"]) + " bytes"
        print "\tgziped compressed: " + str(statistics["compressedGzipSize"]) + " bytes"
        print "\tcompile time:      " + str(statistics["compileTime"]) + " seconds \n"


    def closureCompilerCall(self, filePath, outputInfo):
        print "Making request " + outputInfo + "...",
        sys.stdout.flush()

        content = self.loadFile(filePath)
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


    def execute(self):
        if self.config is not None:
            minFile = open(self.config.build.path + self.config.build.filename +"-"+str(self.config.build.version)+".min.js", "w")
        
        else:
            minFile = open("jsgo.min.js", "w")
        
        response = self.responseParser(self.closureCompilerCall(self.filePath, "compiled_code"))

        if "compiledCode" not in response or response["compiledCode"] == "":
            errors = self.responseParser(self.closureCompilerCall(self.filePath, "errors"))
            self.showErrors(errors)
            return 1
        
        else:
            if self.giveStatistics == True:
                statistics = self.responseParser(self.closureCompilerCall(self.filePath, "statistics"))
                self.showStatistics(statistics)

            if self.config is not None:
                response["compiledCode"] = response["compiledCode"].replace("%version%", str(self.config.build.version))

            now = datetime.now().strftime("%Y-%m-%d %H:%M")
            response["compiledCode"] = response["compiledCode"].replace("%build%", now)

            minFile.write(response["compiledCode"].encode("utf-8"))
            return 0