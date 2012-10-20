JS_FILES = index.js $(shell find lib example -name '*.js')

lint:
	jshint $(JS_FILES) --config jshint.json
