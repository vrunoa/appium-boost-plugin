const { expect } = require('chai');
const sinon = require('sinon');
const { Boost } = require('../dist/boost');

describe ('boost', function () {
  it('should set default speed', function () {
    const b = new Boost();
    expect(b.speed).to.eq(40);
  });
  it('should set speed from options', function () {
    const b = new Boost(null, {speed: 60});
    expect(b.speed).to.eq(60);
  });
  it('should call all methods require to setup boost robot', async function () {
    const hub = {
      connect () {},
      waitForDeviceAtPort () {},
    };
    const mockConnect = sinon.stub(hub, 'connect');
    const mockWait = sinon.stub(hub, 'waitForDeviceAtPort');
    const b = new Boost(hub);
    await b.connect();

    expect(mockConnect.calledOnce).to.eq(true);
    expect(mockWait.calledTwice).to.eq(true);
    expect(mockWait.getCall(0).args[0]).to.eq('A');
    expect(mockWait.getCall(1).args[0]).to.eq('B');
    sinon.restore();
  });

  it('should set motor speed to move forward', async function () {
    const motorA = { setPower () {} };
    const mockMotorA = sinon.stub(motorA, 'setPower');
    const motorB = { setPower () {} };
    const mockMotorB = sinon.stub(motorB, 'setPower');
    const b = new Boost();
    b.motorA = motorA;
    b.motorB = motorB;
    await b.drive();
    expect(mockMotorA.calledOnce).to.eq(true);
    expect(mockMotorA.getCall(0).args[0]).to.eq(b.speed);
    expect(mockMotorB.calledOnce).to.eq(true);
    expect(mockMotorB.getCall(0).args[0]).to.eq(b.speed);
    sinon.restore();
  });
  it('should brake', async function () {
    const motorA = { brake () {} };
    const mockMotorA = sinon.stub(motorA, 'brake');
    const motorB = { brake () {} };
    const mockMotorB = sinon.stub(motorB, 'brake');
    const b = new Boost();
    b.motorA = motorA;
    b.motorB = motorB;
    await b.brake();
    expect(mockMotorA.calledOnce).to.eq(true);
    expect(mockMotorB.calledOnce).to.eq(true);
  });
  it('should set motor speed negative to move backwards', async function () {
    const motorA = { setPower () {} };
    const mockMotorA = sinon.stub(motorA, 'setPower');
    const motorB = { setPower () {} };
    const mockMotorB = sinon.stub(motorB, 'setPower');
    const b = new Boost();
    b.motorA = motorA;
    b.motorB = motorB;
    await b.reverse();
    expect(mockMotorA.calledOnce).to.eq(true);
    expect(mockMotorA.getCall(0).args[0]).to.eq(-1 * b.speed);
    expect(mockMotorB.calledOnce).to.eq(true);
    expect(mockMotorB.getCall(0).args[0]).to.eq(-1 * b.speed);
    sinon.restore();
  });
  it('should set power to move left', async function () {
    const motorA = { brake () {} };
    const mockMotorA = sinon.stub(motorA, 'brake');
    const motorB = { setPower () {} };
    const mockMotorB = sinon.stub(motorB, 'setPower');
    const b = new Boost();
    b.motorA = motorA;
    b.motorB = motorB;
    await b.left();
    expect(mockMotorA.calledOnce).to.eq(true);
    expect(mockMotorB.calledOnce).to.eq(true);
    expect(mockMotorB.getCall(0).args[0]).to.eq(b.speed);
    sinon.restore();
  });
  it('should set power to move right', async function () {
    const motorA = { setPower () {} };
    const mockMotorA = sinon.stub(motorA, 'setPower');
    const motorB = { brake () {} };
    const mockMotorB = sinon.stub(motorB, 'brake');
    const b = new Boost();
    b.motorA = motorA;
    b.motorB = motorB;
    await b.right();
    expect(mockMotorA.calledOnce).to.eq(true);
    expect(mockMotorA.getCall(0).args[0]).to.eq(b.speed);
    expect(mockMotorB.calledOnce).to.eq(true);
    sinon.restore();
  });
});
