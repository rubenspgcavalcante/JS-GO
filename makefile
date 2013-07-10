BUILDPATH=build/jsgo.js
SOURCEDIR=source/
OBJECTDIR=${SOURCEDIR}object/
COLLECTIONDIR=${SOURCEDIR}collection/

.PHONY: build
.PHONY: tests

MODULES = ${SOURCEDIR}license-header.txt\
          ${SOURCEDIR}jsgo-enums.js\
          $(OBJECTDIR)jsgo-object.js\
          $(OBJECTDIR)jsgo-object-types.js\
          $(COLLECTIONDIR)jsgo-collection.js\
          $(COLLECTIONDIR)jsgo-collection-query.js\
          $(COLLECTIONDIR)jsgo-collection-filter.js\
          $(COLLECTIONDIR)jsgo-collection-select.js\
          $(COLLECTIONDIR)jsgo-collection-update.js\
          $(COLLECTIONDIR)jsgo-collection-delete.js\

all: build tests minify

build: ${BUILDPATH}

${BUILDPATH}: ${MODULES}
	rm -f $(BUILDPATH) jsgo.min.js
	cat >> $@ $^

minify:
	python minifier/main.py $(BUILDPATH) --config minifier/config.json --statistics

clean:
	rm -f $(BUILDPATH) jsgo.min.js

tests: build
	nodeunit tests/unitary/genericobject.js
	nodeunit tests/unitary/genericobjectcollection.js

performance: build
	nodejs tests/performance/run.js