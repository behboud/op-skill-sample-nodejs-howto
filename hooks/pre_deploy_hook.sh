#!/bin/bash
# Shell script for ask-cli pre-deploy hook for Node.js
# Script Usage: pre_deploy_hook.sh <SKILL_NAME> <DO_DEBUG> <TARGET>

# SKILL_NAME is the preformatted name passed from the CLI, after removing special characters.
# DO_DEBUG is boolean value for debug logging
# TARGET is the deploy TARGET provided to the CLI. (eg: all, skill, lambda etc.)

# Run this script under skill root folder

# The script does the following:
#  - Run "npm install" in each sourceDir in skill.json

SKILL_NAME=$1
DO_DEBUG=${2:-false}
TARGET=${3:-"all"}

# if [ $DO_DEBUG == false ]
# then
#     exec > /dev/null 2>&1
# fi
echo "###########################"
echo "##### pre-deploy hook #####"
echo "###########################"

install_dependencies() {
    npm install --prefix "$1" >/dev/null 2>&1 
    return $?
}

exit_and_kill_deploy() {
    echo "Exit"
    echo "###########################"
    ps -ef | grep "ask deploy" | grep -v grep | awk '{print $2}' | xargs kill
}

serverless_deploy() {
    sls deploy
    if [[ $? == 0 ]]; then
        service_name=$(grep "service" serverless.yml | cut -d: -f2)
        lambda_function=$(aws lambda list-functions | jq -r --arg service_name $(grep "service" serverless.yml | cut -d: -f2) '.Functions[] | select(.FunctionName | contains($service_name)).FunctionArn')
        popd
        mv skill.json temp.json
        if [[ $? == 1 ]]; then
            exit 1
        fi
        jq -r --arg lf "$lambda_function" '.manifest.apis.custom.endpoint.uri |= $lf' temp.json > skill.json
        rm temp.json
        pushd lambda/custom
    else
        echo "There was a problem deployig with serverless"
        exit 1
    fi
}

if [[ $TARGET == "all" || $TARGET == "lambda" ]]; then
    grep "sourceDir" ./skill.json | cut -d: -f2 |  sed 's/"//g' | sed 's/,//g' | while read -r SOURCE_DIR; do
        if install_dependencies $SOURCE_DIR; then
            echo "Codebase ($SOURCE_DIR) built successfully."
        else
            echo "There was a problem installing dependencies for ($SOURCE_DIR)."
            exit 1
        fi
    done
    pushd lambda/custom
    serverless_deploy
    if [[ $TARGET == "all" ]]; then
        jq -r '.alexa.invocation |  to_entries[] | "\(.key) \(.value| @base64)"' package.json |
        while read -r locale invocation; do
            npx alexa-language-model-generator -i "$(echo $invocation | base64 --decode)" -l $locale -n intents.yml -t types.yml -m ../../models
        done
        popd
        ask deploy -t skill --force
        if [[ $? == 0 ]]; then
            skillIdInServerless=$(grep "alexaSkill" lambda/custom/serverless.yml | cut -d: -f2 | tr -d ' ')
            if [[ $skillIdInServerless == "-alexaSkill" ]]; then
                sed -i.bak "s/- alexaSkill/- alexaSkill: $(jq -r '.deploy_settings.default.skill_id' .ask/config)/g" lambda/custom/serverless.yml
                pushd lambda/custom
                serverless_deploy
                popd
            fi
        fi
        ask deploy -t model
        ask deploy -t isp
    fi
    exit_and_kill_deploy
    echo "###########################"
fi

exit 0