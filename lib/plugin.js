/* eslint-disable no-case-declarations */
import BasePlugin from '@appium/base-plugin';
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const PoweredUP = require('node-poweredup');
const poweredUP = new PoweredUP.PoweredUP();

let cleanBoost = {
  hub: null,
  motorA: null,
  motorB: null,
  sleep: 40
};

let _boost = cleanBoost;

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
    if (!_boost.hub) {
      try {
        _boost.hub = await this.boostDiscover();
        await _boost.hub.connect();
        _boost.motorA = await _boost.hub.waitForDeviceAtPort('A');
        _boost.motorB = await _boost.hub.waitForDeviceAtPort('B');
        console.log('Hub connected');
      } catch (err) {
        await this.boostDisconnect();
      }
    }
  }

  // avoid require-await
  // eslint-disable-next-line
  async boostDisconnect () {
    poweredUP.stop();
    _boost = cleanBoost;
  }

  async boostDrive () {
    const speed = Math.abs(_boost.sleep);
    await _boost.motorA.setPower(speed);
    await _boost.motorB.setPower(speed);
  }

  async boostBrake () {
    const speed = _boost.speed > 0 ? -1 * _boost.speed : _boost.speed;
    await _boost.motorA.brake();
    await _boost.motorB.brake();
    await _boost.motorA.setPower(speed);
    await _boost.motorB.setPower(speed);
  }

  async boostLeft () {
    await _boost.motorB.setPower(_boost.speed);
    await _boost.motorA.brake();
  }

  async boostRight () {
    await _boost.motorA.setPower(_boost.speed);
    await _boost.motorB.brake();
  }

  async handle (next, driver, cmdName) {
    if (cmdName === 'deleteSession') {
      await this.boostDisconnect();
    }
    return await next();
  }
}

export { AppiumBoostPlugin };
