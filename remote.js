const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();
const readline = require('readline');


poweredUP.on("discover", async (hub) => { // Wait to discover a Hub
    console.log(`Discovered ${hub.name}!`);
    await hub.connect(); // Connect to the Hub
    const motorA = await hub.waitForDeviceAtPort("A"); // Make sure a motor is plugged into port A
    const motorB = await hub.waitForDeviceAtPort("B"); // Make sure a motor is plugged into port B
    console.log("Connected");
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    var currentKey;
    var speed = 40;
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c' ) {
        process.exit();
      }
      console.log(key);
      if (key.name === 'up') {
          speed = Math.abs(speed)
          motorA.setPower(speed)
          motorB.setPower(speed)
      } else if (key.name === 'down') {
          speed = speed > 0 ? -1*speed : speed;
          motorA.brake()
          motorB.brake()
          motorA.setPower(speed)
          motorB.setPower(speed)
      } else if (key.name === 'space') {
          motorA.brake()
          motorB.brake()
      } else if (key.name === 'left') {
          motorB.setPower(speed)
          motorA.brake()
      } else if (key.name === 'right') {
          motorA.setPower(speed)
          motorB.brake()
      }
      currentKey = key;
    })
});

poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");
