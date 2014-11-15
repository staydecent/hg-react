BIN = ./node_modules/.bin

build: 
	@rm -rf ./dist
	@mkdir ./dist
	@$(BIN)/webpack --progress --colors

watch:
	@$(BIN)/webpack --progress --colors --watch

examples-build:
	@$(BIN)/webpack --config examples.config.js --progress --colors
