#!/bin/bash

cd "$(dirname "$0")"

# Colors:
# http://stackoverflow.com/questions/5412761/using-colors-with-printf/5413029#5413029
# http://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
NORMAL=$(tput sgr0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)

printf "\n${BLUE}Checking for npm-linked packages:${NORMAL}"
if [[ $(ls -al ../node_modules | grep ^l | wc -l) == "0" ]]; then
    printf "${GREEN} Folder node_modules/ is free of npm-linked packages\n\n"
    exit 0
else
    echo "${RED} npm linked package(s) found${NORMAL}"
    printf "${YELLOW}Warning: Get rid of npm-linked packages (they are generally used for debugging purposes)${NORMAL}"

    printf "\n${YELLOW}\n# List the npm-linked packages${NORMAL}\n"
    echo "${BLUE}$ ls -l ../node_modules | grep ^l${NORMAL}"
                   ls -l ../node_modules | grep ^l
    echo ""
    exit 1
fi
