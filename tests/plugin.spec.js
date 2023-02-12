const { expect } = require('chai');
const sinon = require('sinon');
const { AppiumBoostPlugin } = require('../dist/plugin');
const { EventEmitter } = require('node:events');
const mockRequire = require('mock-require');

describe ('plugin', function () {
  it('should set options', function () {
    const p = new AppiumBoostPlugin('my plugin', {speed: 50});
    expect(p.opts.speed).to.eq(50);
  });
  it('should create new boost and connect', async function () {
    const p = new AppiumBoostPlugin('my plugin');
    expect(p.boost).to.eq(null);
    const boost = {
      connect: function () {}
    }
    const mockConnect = sinon.stub(boost, 'connect');
    const mockDiscover = sinon.stub(p, 'boostDiscover').callsFake(() => {
      return boost;
    });
    await p.boostConnect();
    expect(mockDiscover.calledOnce).to.eq(true);
    expect(mockConnect.calledOnce).to.eq(true);
    expect(p.boost).to.not.eq(null);
    sinon.restore();
  });

  it('should discconect and remove boots', async function () {
    const p = new AppiumBoostPlugin('my plugin');
    expect(p.boost).to.eq(null);
    const boost = {
      connect: function () {}
    }
    const poweredUp = {
      stop: function () {}
    }
    p.poweredUP = poweredUp;
    const mockConnect = sinon.stub(boost, 'connect');
    const mockDiscover = sinon.stub(p, 'boostDiscover').callsFake(() => {
      return boost;
    });
    const mockStop = sinon.stub(poweredUp, 'stop');
    await p.boostConnect();
    expect(mockDiscover.calledOnce).to.eq(true);
    expect(mockConnect.calledOnce).to.eq(true);
    expect(p.boost).to.not.eq(null);
    await p.boostDisconnect();
    expect(mockStop.calledOnce).to.eq(true);
    expect(p.boost).to.eq(null);
  });
  it('should call drive', async function () {
    const p = new AppiumBoostPlugin('my plugin');
    const boost = {
      connect: function () {},
      drive: function () {}
    }
    const mockConnect = sinon.stub(boost, 'connect');
    const mockDrive = sinon.stub(boost, 'drive');
    const mockDiscover = sinon.stub(p, 'boostDiscover').callsFake(() => {
      return boost;
    });
    await p.boostConnect();
    expect(mockDiscover.calledOnce).to.eq(true);
    expect(mockConnect.calledOnce).to.eq(true);
    expect(p.boost).to.not.eq(null);
    await p.boostDrive();
    expect(mockDrive.calledOnce).to.eq(true);
  });
  it('should call reverse', async function () {
    const p = new AppiumBoostPlugin('my plugin');
    const boost = {
      connect: function () {},
      reverse: function () {}
    }
    const mockConnect = sinon.stub(boost, 'connect');
    const mockReverse = sinon.stub(boost, 'reverse');
    const mockDiscover = sinon.stub(p, 'boostDiscover').callsFake(() => {
      return boost;
    });
    await p.boostConnect();
    expect(mockDiscover.calledOnce).to.eq(true);
    expect(mockConnect.calledOnce).to.eq(true);
    expect(p.boost).to.not.eq(null);
    await p.boostReverse();
    expect(mockReverse.calledOnce).to.eq(true);
  });
  it('should call brake', async function () {
    const p = new AppiumBoostPlugin('my plugin');
    const boost = {
      connect: function () {},
      brake: function () {}
    }
    const mockConnect = sinon.stub(boost, 'connect');
    const mockBrake = sinon.stub(boost, 'brake');
    const mockDiscover = sinon.stub(p, 'boostDiscover').callsFake(() => {
      return boost;
    });
    await p.boostConnect();
    expect(mockDiscover.calledOnce).to.eq(true);
    expect(mockConnect.calledOnce).to.eq(true);
    expect(p.boost).to.not.eq(null);
    await p.boostBrake();
    expect(mockBrake.calledOnce).to.eq(true);
  });
  it('should call left', async function () {
    const p = new AppiumBoostPlugin('my plugin');
    const boost = {
      connect: function () {},
      left: function () {}
    }
    const mockConnect = sinon.stub(boost, 'connect');
    const mockLeft = sinon.stub(boost, 'left');
    const mockDiscover = sinon.stub(p, 'boostDiscover').callsFake(() => {
      return boost;
    });
    await p.boostConnect();
    expect(mockDiscover.calledOnce).to.eq(true);
    expect(mockConnect.calledOnce).to.eq(true);
    expect(p.boost).to.not.eq(null);
    await p.boostLeft();
    expect(mockLeft.calledOnce).to.eq(true);
  });
  it('should call right', async function () {
    const p = new AppiumBoostPlugin('my plugin');
    const boost = {
      connect: function () {},
      right: function () {}
    }
    const mockConnect = sinon.stub(boost, 'connect');
    const mockRight = sinon.stub(boost, 'right');
    const mockDiscover = sinon.stub(p, 'boostDiscover').callsFake(() => {
      return boost;
    });
    await p.boostConnect();
    expect(mockDiscover.calledOnce).to.eq(true);
    expect(mockConnect.calledOnce).to.eq(true);
    expect(p.boost).to.not.eq(null);
    await p.boostRight();
    expect(mockRight.calledOnce).to.eq(true);
  });
  it('should call disconnect on deleteSession', async function () {
    const p = new AppiumBoostPlugin('my plugin');
    const mockDisconnect = sinon.stub(p, 'boostDisconnect');
    const mockNext = sinon.fake();
    await p.handle(mockNext, {}, 'deleteSession');
    expect(mockDisconnect.calledOnce).to.eq(true);
  });
  it('should return boost on discover', async function () {
    const hub = {
      name: 'fake hub'
    };
    const mockScan = sinon.fake();
    const fakeEmitter = new EventEmitter();
    fakeEmitter.scan = mockScan;
    setTimeout(function(){
      fakeEmitter.emit('discover', hub)
    }, 500);
    const PoweredUp = {
      PoweredUP: function () {
        return fakeEmitter;
      }
    }
    mockRequire('node-poweredup', PoweredUp);
    const p = new AppiumBoostPlugin('my plugin');
    const boost = await p.boostDiscover();
    expect(mockScan.calledOnce).to.eq(true);
    expect(boost).to.not.eq(null);
    expect(boost.hub).to.not.eq(null);
    expect(boost.hub.name).to.eq('fake hub');
  });
});
