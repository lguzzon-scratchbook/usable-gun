#!/usr/bin/env bash
rm -rf dist || true
# Build the HTML file with Bun
# using the Bun build command
# to bundle the HTML file and its dependencies
# into a single output directory
# with ES module format, targeting the browser
# and minifying the output
# and enabling code splitting
# The output will be in the "dist" directory
# and the entry point will be "index.html"
bun build ./index.html --outdir dist --format esm --target browser --minify --splitting
