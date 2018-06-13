#!/bin/bash

cd "$(dirname "$0")"    # Change directory to the folder containing this file
cd ../..                # Change directory to project's root folder

# Colors:
# http://stackoverflow.com/questions/5412761/using-colors-with-printf/5413029#5413029
# http://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
NORMAL=$(tput sgr0)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)

printf "\n${YELLOW}About to clean up node_modules directory (will be reinstalled automatically):${NORMAL}"
printf " 5" ; sleep 1
printf " 4" ; sleep 1
printf " 3" ; sleep 1
printf " 2" ; sleep 1
printf " 1" ; sleep 1
printf " Start"

printf "\n${BLUE}$ rm -rf node_modules${NORMAL}\n"
                   rm -rf node_modules
printf "\n${BLUE}$ rm -f package-lock.json${NORMAL}\n"
                   rm -f package-lock.json

# Repeat the same steps for the "live-css" folder
printf "\n${BLUE}$ cd live-css${NORMAL}\n"
                   cd live-css
printf "\n${BLUE}$ rm -rf node_modules${NORMAL}\n"
                   rm -rf node_modules
printf "\n${BLUE}$ rm -f package-lock.json${NORMAL}\n"
                   rm -f package-lock.json

# Install inside the "live-css" directory first
printf "\n${BLUE}$ npm install${NORMAL}\n"
                   npm install

# Install inside the root directory later
printf "\n${BLUE}$ cd ..${NORMAL}\n"
                   cd ..
printf "\n${BLUE}$ npm install${NORMAL}\n"
                   npm install
