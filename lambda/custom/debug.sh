#!/usr/bin/env bash
#bst proxy lambda .webpack/service/src/index.js
debuguri=https://$(jq -r '.sourceID' ~/.bst/config).bespoken.link
jq -r --arg uri "$debuguri" '.manifest.apis.custom.endpoint |= {uri: $uri , sslCertificateType: "Wildcard"}' ../../skill.json > ../../debugSkill.json
pushd ../../
skillid=$(jq -r '.deploy_settings.default.skill_id' .ask/config)
ask api update-skill -s $skillid -f debugSkill.json
popd
node --inspect --debug $(which sls) offline start --dontPrintOutput -t -l .webpack/service/src