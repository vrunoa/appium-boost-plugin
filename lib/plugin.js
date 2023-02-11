/* eslint-disable no-case-declarations */
import BasePlugin from '@appium/base-plugin';
import path from 'path';
import { ADB } from 'appium-adb';
import { SubProcess } from 'teen_process';
import { sleep } from 'asyncbox';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const PoweredUP = require("node-poweredup");

let _adb = null;

export default class AppiumBoostPlugin extends BasePlugin {
    static newMethodMap = {
        '/session/:sessionId/appium/boost_connect': {
            POST: {
                command: 'boostConnect',
                neverProxy: true
            }
        },
        '/session/:sessionId/appium/boost_disconnect': {
            POST: {
                command: 'boostDisconnect',
                neverProxy: true
            }
        },
        '/session/:sessionId/appium/boost_speed': {
            POST: {
                command: 'boostSpeed',
                payloadParams: {
                    required: ['speed']
                },
                neverProxy: true
            }
        },
        '/session/:sessionId/appium/boost_drive': {
            POST: {
                command: 'boostDrive',
                payloadParams: {
                    optional: ['speed']
                },
                neverProxy: true
            }
        },
        '/session/:sessionId/appium/boost_brake': {
            POST: {
                command: 'boostBrake',
                neverProxy: true
            }
        },
        '/session/:sessionId/appium/boost_left': {
            POST: {
                command: 'boostLeft',
                neverProxy: true
            }
        },
        '/session/:sessionId/appium/boost_right': {
            POST: {
                command: 'boostRight',
                neverProxy: true
            }
        }
    };

    constructor (pluginName, opts = {}) {
        super(pluginName);
        this.opts = opts;
    }

    async waitForBoost (nap = 100, retries = 5) {
        throw new Error('cant coonect with Boost');
    }

    async boostDisconnect(next, driver, ...args) {

    }

    async handle (next, driver, cmdName) {
        if (cmdName === 'deleteSession') {
            await this.boostDisconnect();
        }
        return await next();
    }
}

export { AppiumBoostPlugin };
