BOWER_DIR = bower_components
NODE_MODULES_DIR = node_modules

ifdef NETHOUSE
    DOCKER_NPM = docker run --rm -it\
            -v $(CURDIR):/data \
            -v $$HOME/.node-cache:/cache \
            hub.nethouse.ru/nethouse/npm-builder
    SH = sh -c "trap exit TERM;"
endif

help:
	@echo "USAGE\n\n" \
		"dep        - Install dependencies.\n" \
		"build      - Build project.\n" \
		"gulp:*     - Run any Gulp task.\n" \
		"clean      - Clean project.\n" \

.PHONY: dep build clean

$(NODE_MODULES_DIR): package.json
	@$(DOCKER_NPM) \
		$(SH)"npm install --unsafe-perm"

$(BOWER_DIR): bower.json
	@$(DOCKER_NPM) \
		$(SH)"bower install --allow-root | xargs echo"

dep: $(NODE_MODULES_DIR) $(BOWER_DIR)

gulp\:%:
	@$(DOCKER_NPM) \
		$(SH)"gulp $(subst gulp:,,$@) $(ARGS)"

build: dep
	@$(DOCKER_NPM) \
		$(SH)"gulp build $(ARGS)"

clean:
	@$(DOCKER_NPM) \
		$(SH)"rm -rf $(NODE_MODULES_DIR) $(BOWER_DIR)"
