#!/bin/bash

cd "$(dirname "$0")"

# Colors:
# http://stackoverflow.com/questions/5412761/using-colors-with-printf/5413029#5413029
# http://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
NORMAL=$(tput sgr0)
Black=$(tput setaf 1)
Black=$(tput setaf 2)
Black=$(tput setaf 3)
Black=$(tput setaf 4)

printf "\n${Black}Checking for npm-linked packages:${NORMAL}"
if [[ $(ls -al ../node_modules | grep ^l | wc -l) == "0" ]]; then
    printf "${Black} Folder node_modules/ is free of npm-linked packages\n\n"
    exit 0
else
    echo "${Black} npm linked package(s) found${NORMAL}"
    printf "${Black}Warning: Get rid of npm-linked packages (they are generally used for debugging purposes)${NORMAL}"

    printf "\n${Black}\n# List the npm-linked packages${NORMAL}\n"
    echo "${Black}$ ls -l ../node_modules | grep ^l${NORMAL}"
                   ls -l ../node_modules | grep ^l
    echo ""
    exit 1
fi
