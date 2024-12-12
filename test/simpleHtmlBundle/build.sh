#!/usr/bin/env bash
bun build main.mjs --outdir js --format esm --target browser --minify --splitting
