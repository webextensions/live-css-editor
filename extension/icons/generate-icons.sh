#!/bin/bash

set -x

cd "$(dirname "$0")"

# https://stackoverflow.com/questions/9853325/how-to-convert-a-svg-to-a-png-with-imagemagick/14174624#14174624

# Inkscape v1.0+
# inkscape -w 256 -h 256 icon-256.svg -o icon-256.png

# Inkscape older than v1.0
inkscape -z -w 256 -h 256 icon-256.svg -e icon-256.png
inkscape -z -w 128 -h 128 icon-256.svg -e icon-128.png
inkscape -z -w  64 -h  64 icon-256.svg -e icon-64.png
inkscape -z -w  48 -h  48 icon-256.svg -e icon-48.png
inkscape -z -w  40 -h  40 icon-256.svg -e icon-40.png
inkscape -z -w  32 -h  32 icon-256.svg -e icon-32.png
inkscape -z -w  24 -h  24 icon-256.svg -e icon-24.png
inkscape -z -w  16 -h  16 icon-256.svg -e icon-16.png
