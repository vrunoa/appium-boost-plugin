(async () => {
  const { AppiumBoostPlugin } = require('../dist/index');
  const { sleep } = require('asyncbox');
  const plugin = new AppiumBoostPlugin();
  await plugin.boostConnect();
  await plugin.boostDrive();
  await sleep(3500);
  await plugin.boostBrake();
  await plugin.boostReverse();
  await sleep(3500);
  await plugin.boostBrake();
  await plugin.boostDisconnect();
})();
