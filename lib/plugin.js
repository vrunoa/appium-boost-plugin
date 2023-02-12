/* eslint-disable no-case-declarations */
import BasePlugin from '@appium/base-plugin';
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const PoweredUP = require('node-poweredup');
const poweredUP = new PoweredUP.PoweredUP();
const { Boost } = require('./boost');

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
        neverProxy: true
      }
    },
    '/session/:sessionId/appium/boost_drive': {
      POST: {
        command: 'boostDrive',
        neverProxy: true
      }
    },
    '/session/:sessionId/appium/boost_reverse': {
      POST: {
        command: 'boostReverse',
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
    this.boost = null;
  }

  boostDiscover () {
    // avoid promise/no-native lint issue
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      const ac = new AbortController();
      const signal = ac.signal;

      setTimeoutPromise(15000, '', { signal })
        .then(() => {
          console.error('Timeout: Failed to find Hubs :(');
          reject();
        })
        .catch((err) => {
          if (err.name === 'AbortError') {console.log('Connect timeout was aborted');}
        });

      poweredUP.on('discover', (hub) => {
        console.log(`Discovered ${hub.name}!`);
        ac.abort();
        resolve(hub);
      });

      console.log('Scanning for Hubs...');
      poweredUP.scan();
    });
  }

  async boostConnect () {
    let hub = await this.boostDiscover();
    this.boost = new Boost(hub, this.opts);
    await this.boost.connect();
    console.log('Hub connected');
  }

  // avoid require-await
  // eslint-disable-next-line
  async boostDisconnect () {
    poweredUP.stop();
    delete this.boost;
  }

  async boostDrive () {
    await this.boost.drive();
  }

  async boostReverse () {
    await this.boost.reverse();
  }

  async boostBrake () {
    await this.boost.brake();
  }

  async boostLeft () {
    await this.boost.left();
  }

  async boostRight () {
    await this.boost.right();
  }

  async handle (next, driver, cmdName) {
    if (cmdName === 'deleteSession') {
      await this.boostDisconnect();
    }
    return await next();
  }
}

export { AppiumBoostPlugin };
