#!/bin/bash
set -eo pipefail

# Clean temporary and build files
rm -rf dist node_modules/.cache &
find src -type f \( -name '*.js' -o -name '*.map' \) -exec rm {} \+

wait
