const defaultSpeed = 40;

class Boost {
  constructor (hub, opts = {}) {
    this.hub = hub;
    this.speed = opts.speed || defaultSpeed;
  }

  async connect () {
    await this.hub.connect();
    this.motorA = await this.hub.waitForDeviceAtPort('A');
    this.motorB = await this.hub.waitForDeviceAtPort('B');
  }

  // move forward
  async drive () {
    const speed = Math.abs(this.speed);
    await this.motorA.setPower(speed);
    await this.motorB.setPower(speed);
  }

  // stop
  async brake () {
    await this.motorA.brake();
    await this.motorB.brake();
  }

  // move backwards
  async reverse () {
    const speed = -1 * this.speed;
    await this.motorA.setPower(speed);
    await this.motorB.setPower(speed);
  }

  async left () {
    await this.motorB.setPower(this.speed);
    await this.motorA.brake();
  }

  async right () {
    await this.motorA.setPower(this.speed);
    await this.motorB.brake();
  }
}

export default Boost;
export { Boost };
