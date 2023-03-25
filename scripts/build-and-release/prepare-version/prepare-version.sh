#!/bin/bash

# This script assists in preparing changes for a new release version (to be followed by git commit, tag and push operations).

# Steps that happen when a new version is created by "npm version ..." command:
#     (Note: Paths are w.r.t. project root)
#
#     Step 1: (Handled by "npm version ..." command)
#         Update  ./package.json
#         git add ./package.json
#         Update  ./package-lock.json
#         git add ./package-lock.json
#     Step 2: (Handled by npm script "version")
#         Update  ./live-css/package.json
#         git add ./live-css/package.json
#         Update  ./live-css/package-lock.json
#         git add ./live-css/package-lock.json
#         Update  ./tests/package.json
#         git add ./tests/package.json
#         Update  ./tests/package-lock.json
#         git add ./tests/package-lock.json
#         Run ./extension/manifest-generator.mjs
#         git add extension/manifest.json
#         git add extension/manifest-*.json
#     Step 3: (Handled by "npm version ..." command)
#         git commit -m "<version>"
#         git tag -a "v<version>" -m "<version>"
#     Step 4: (Should be handled by npm script "postversion")
#         git push --follow-tags

# https://stackoverflow.com/questions/2870992/automatic-exit-from-bash-shell-script-on-error
# https://stackoverflow.com/questions/821396/aborting-a-shell-script-if-any-command-returns-a-non-zero-value
set -e

set -x

cd "$(dirname "$0")"

cd ../../../

packageVersionWithQuotes=$(jq ".version" ./package.json)
packageVersionWithoutQuotes=$(jq --raw-output ".version" ./package.json)

# Update and add:
#     ./live-css/package.json
#     ./live-css/package-lock.json
#     ./tests/package.json
#     ./tests/package-lock.json
echo "$( jq '.version              = '$packageVersionWithQuotes'' ./live-css/package.json      )" > ./live-css/package.json
echo "$( jq '.version              = '$packageVersionWithQuotes'' ./live-css/package-lock.json )" > ./live-css/package-lock.json
echo "$( jq '.packages[""].version = '$packageVersionWithQuotes'' ./live-css/package-lock.json )" > ./live-css/package-lock.json
echo "$( jq '.version              = '$packageVersionWithQuotes'' ./tests/package.json         )" > ./tests/package.json
echo "$( jq '.version              = '$packageVersionWithQuotes'' ./tests/package-lock.json    )" > ./tests/package-lock.json
echo "$( jq '.packages[""].version = '$packageVersionWithQuotes'' ./tests/package-lock.json    )" > ./tests/package-lock.json
git add ./live-css/package.json
git add ./live-css/package-lock.json
git add ./tests/package.json
git add ./tests/package-lock.json

# Update and add manifest.json and related files
./extension/manifest-generator.mjs
git add extension/manifest.json
git add extension/manifest-*.json

# Update and add ./extension/scripts/appVersion.js
sed -i --regexp-extended 's/const magicCssVersion = ['\''0-9.;]+/const magicCssVersion = '\'''$packageVersionWithoutQuotes''\'';/' ./extension/scripts/appVersion.js
git add ./extension/scripts/appVersion.js

# Update and add ./extension/scripts/background-magicss-include.js
sed -i --regexp-extended 's/"version": "[0-9.]+"/"version": '$packageVersionWithQuotes'/' ./extension/scripts/background-magicss-include.js
git add ./extension/scripts/background-magicss-include.js

# Update and add ./live-css/default.live-css.config.js
sed -i --regexp-extended 's/"version": "[0-9.]+"/"version": '$packageVersionWithQuotes'/' ./live-css/default.live-css.config.js
git add ./live-css/default.live-css.config.js
