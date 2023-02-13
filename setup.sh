#!/bin/bash
if [[ -f .env ]]; then
  source .env
fi
if [[ -z $APPIUM_SOURCE_HOME ]]; then
  echo 'please set APPIUM_SOURCE_HOME'
  exit 1
fi
echo "using $APPIUM_SOURCE_HOME"
pushd $APPIUM_SOURCE_HOME
echo "getting latest appium@2.0 changes"
git fetch
git co appium@2.0.0-beta.48
git pull origin appium@2.0.0-beta.48
echo "installing appium@2.0 dependencies"
npm i
echo "installing driver"
npm start -- driver install uiautomator2 || echo 1
popd
echo "installing plugin dependencies"
npm i --force
