TESTS = test/*.js
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 100 \
	  --ui tdd \
		--growl \
		$(TESTS)

all: test

.PHONY: test
