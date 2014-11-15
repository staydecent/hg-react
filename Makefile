BIN = ./node_modules/.bin

build: 
	@rm -rf ./dist
	@mkdir ./dist
	@$(BIN)/webpack --progress --colors

watch:
	@$(BIN)/webpack --progress --colors --watch