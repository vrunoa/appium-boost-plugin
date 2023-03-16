#!/bin/bash
PLUGIN_HOME=$(pwd)
exists=$(npx appium@2.0.0-beta.57 plugin list --installed --json 2>/dev/null | jq '.frida!=null')
if [[ $exists == "true" ]]; then
  echo "uninstalling plugin"
  npx appium@2.0.0-beta.57 plugin uninstall frida
fi
echo "installing plugin"
npx appium@2.0.0-beta.57 plugin install --source local $PLUGIN_HOME
echo "launching appium"
npx appium@2.0.0-beta.57 server --use-plugins=boost
