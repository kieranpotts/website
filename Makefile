#
# Task runners for this project's development lifecycle.
#

.PHONY: install build clean watch preview serve preview-ui preview-ui-serve lint lint-css lintcheck version help

help:
	@echo "Available targets:"
	@echo "  install           - Install project dependencies"
	@echo "  build             - Build the site and write the output to public/"
	@echo "  clean             - Remove build output and caches (public/, cache/, src/ui/dist/, www/, tmp/)"
	@echo "  watch             - Watch src/ and rebuild the site automatically, without serving it"
	@echo "  preview           - Watch src/ and serve the site at http://localhost:8080, rebuilding on change"
	@echo "  serve             - Serve the already-built site at http://localhost:8080"
	@echo "  preview-ui        - Build the UI theme against a dummy sample site, output to www/"
	@echo "  preview-ui-serve  - Build the UI theme against a dummy sample site and serve it at http://localhost:8081"
	@echo "  lint              - Build the site, failing on broken links or other content warnings"
	@echo "  lint-css          - Lint the UI theme's stylesheets with stylelint"
	@echo "  linkcheck         - Serve the built site and crawl it for broken links. Run 'make build' first"
	@echo "  version           - Tag a new version"
	@echo "  help              - Show this help message"

install:
	./run/install

build:
	./run/build

clean:
	./run/clean

watch:
	./run/watch

preview:
	./run/preview

serve:
	./run/serve

preview-ui:
	./run/preview-ui

preview-ui-serve:
	./run/preview-ui-serve

lint:
	./run/lint

lint-css:
	./run/lint-css

linkcheck:
	./run/linkcheck

version:
	./run/version
