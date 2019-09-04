#!/bin/bash
find . -name node_modules -type d -exec rm -r {} + > /dev/null 2>&1
find . -name out -type d -exec rm -r {} + > /dev/null 2>&1
find . -name typings -type d -exec rm -r {} + > /dev/null 2>&1
find . -name .nyc-output -type d -exec rm -r {} + > /dev/null 2>&1