.DEFAULT_GOAL := help

install: ## Install project dependencies
	./run/install

build: ## Build the site and write the output to public/
	./run/build

clean: ## Remove build output and caches (public/, cache/, src/ui/dist/, www/, tmp/)
	./run/clean

watch: ## Watch src/ and rebuild the site automatically, without serving it
	./run/watch

preview: ## Watch src/ and serve the site at http://localhost:8080, rebuilding on change
	./run/preview

serve: ## Serve the already-built site at http://localhost:8080
	./run/serve

preview-ui: ## Build the UI theme against a dummy sample site, output to www/
	./run/preview-ui

preview-ui-serve: ## Build the UI theme against a dummy sample site and serve it at http://localhost:8081
	./run/preview-ui-serve

lint: ## Build the site, failing on broken links or other content warnings
	./run/lint

lint-css: ## Lint the UI theme's stylesheets with stylelint
	./run/lint-css

linkcheck: ## Serve the built site and crawl it for broken links. Run 'make build' first
	./run/linkcheck

version: ## Tag a new version
	./run/version

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: install build clean watch preview serve preview-ui preview-ui-serve lint lint-css linkcheck version help
