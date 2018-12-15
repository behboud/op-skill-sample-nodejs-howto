#!/bin/bash
# Shell script for ask-cli post-new hook for Node.js
# Script Usage: post_new_hook.sh <SKILL_NAME> <DO_DEBUG> <TARGET>
 
# SKILL_NAME is the preformatted name passed from the CLI, after removing special characters.
# DO_DEBUG is boolean value for debug logging
 
# Run this script one level outside of the skill root folder
 
# The script does the following:
#  - Run "npm install" in each sourceDir in skill.json

SKILL_NAME=$1
DO_DEBUG=${2:-false}

echo "###########################"
echo "###### post-new hook ######"
echo "###########################"

pushd $SKILL_NAME/lambda/custom
npm i
popd
sed -i.bak "s/service: alexa/service: $SKILL_NAME/g" $SKILL_NAME/lambda/custom/serverless.yml
rm -rf $SKILL_NAME/.git
echo "###########################"

exit 0