all: build minify

build:
	cat license-header.txt > jsgo.js
	cat source/jsgo-enums.js >> jsgo.js
	cat source/object/jsgo-object.js >> jsgo.js
	cat source/object/jsgo-object-types.js >> jsgo.js
	cat source/collection/jsgo-collection.js >> jsgo.js
	cat source/collection/jsgo-collection-query.js >> jsgo.js
	cat source/collection/jsgo-collection-filter.js >> jsgo.js
	cat source/collection/jsgo-collection-select.js >> jsgo.js
	cat source/collection/jsgo-collection-update.js >> jsgo.js
	cat source/collection/jsgo-collection-delete.js >> jsgo.js

minify:
	python minify.py jsgo.js --config config.json --statistics

clean:
	rm -f jsgo.js jsgo.min.js