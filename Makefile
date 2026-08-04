.DEFAULT_GOAL := help

install: ## Install project dependencies
	./run/install

build: ## Build the site and write the output to public/
	./run/build

preview: ## Start the live preview server on http://localhost:8080
	./run/preview

serve: ## Serve the built site at http://localhost:8080
	./run/serve

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: install build preview serve help
