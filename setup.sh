#!/bin/bash
exists=$(npx appium@2.0.0-beta.57 driver list --installed --json 2>/dev/null | jq '.uiautomator2!=null')
if [[ $exists != "true" ]]; then
  echo "installing uiautomator2 driver"
  npx appium@2.0.0-beta.57 driver install uiautomator2
fi
echo "installing plugin dependencies"
npm ci
