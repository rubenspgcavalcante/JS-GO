all: build minify

build:
	cat license-header.txt > jsgo.js
	cat source/jsgo-object.js >> jsgo.js
	cat source/jsgo-object-types.js >> jsgo.js
	cat source/jsgo-collection.js >> jsgo.js

minify:
	python minify.py jsgo.js --statistics

clean:
	rm -f jsgo.js jsgo.min.js