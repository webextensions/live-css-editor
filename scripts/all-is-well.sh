#!/bin/bash

# Colors:
# http://stackoverflow.com/questions/5412761/using-colors-with-printf/5413029#5413029
# http://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
NORMAL=$(tput sgr0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)

cd "$(dirname "$0")"

printf "\n${BLUE}$ ./ensure-no-npm-links.sh${NORMAL}\n"
                   ./ensure-no-npm-links.sh
exitCodeNoNpmLinks=$?

printf "\n${BLUE}$ ../live-css/scripts/ensure-no-npm-links.sh${NORMAL}\n"
                   ../live-css/scripts/ensure-no-npm-links.sh
exitCodeNoNpmLinksInLiveCss=$?

printf "\n${BLUE}$ ./version-consistency-check.js${NORMAL}\n"
                   ./version-consistency-check.js
exitCodeVersionConsistency=$?

cd ..

printf "\n${BLUE}$ npm run lint${NORMAL}\n"
                   npm run lint
exitCodeLint=$?

if [ "$exitCodeNoNpmLinks" == "0" ] && [ "$exitCodeNoNpmLinksInLiveCss" == "0" ] && [ "$exitCodeVersionConsistency" == "0" ] && [ "$exitCodeLint" == "0" ]; then
    printf "\n${GREEN}Success: All is well :-) ${NORMAL}\n"
    exit 0
else
    if [ "$exitCodeNoNpmLinks" != "0" ]; then
        printf "\n${YELLOW}Warning: Get rid of npm linked packages in node_modules (they are generally used for debugging/development purposes)${NORMAL}"
    fi
    if [ "$exitCodeNoNpmLinksInLiveCss" != "0" ]; then
        printf "\n${YELLOW}Warning: Get rid of npm linked packages in live-css/node_modules (they are generally used for debugging/development purposes)${NORMAL}"
    fi
    if [ "$exitCodeVersionConsistency" != "0" ]; then
        printf "\n${RED}Error: Failure in code version consistency${NORMAL}"
    fi
    if [ "$exitCodeLint" != "0" ]; then
        printf "\n${RED}Error: Failure in code linting${NORMAL}"
    fi
    printf "\n"
    exit 1
fi
