#!/bin/bash
if [[ -f .env ]]; then
  source .env
fi
if [[ -z $APPIUM_SOURCE_HOME ]]; then
  echo 'please set APPIUM_SOURCE_HOME'
  exit 1
fi
PLUGIN_HOME=$(pwd)
echo "installing plugin"
pushd $APPIUM_SOURCE_HOME
npm start -- plugin uninstall boost || true
npm start -- plugin install --source local $PLUGIN_HOME
echo "launching appium"
npm start --prefix $APPIUM_SOURCE_HOME -- server --use-plugins=boost
popd
