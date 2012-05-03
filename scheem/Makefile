TESTS = js/test/*.js
REPORTER = dot

setup:
	$(MAKE) prepare && $(MAKE) peg

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 100 \
	  --ui tdd \
		--growl \
		$(TESTS)

# compile the peg/scheem.pegjs file when we're using a browser
peg:
	./node_modules/pegjs/bin/pegjs -e ScheemPeg peg/scheem.pegjs js/generated/scheemPeg.js

prepare:
	npm install

all: test

.PHONY: test peg prepare setup
