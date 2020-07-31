const notificationsLoaderInit = require('./notificationsLoader');
const dappsLoaderInit = require('./dappsLoader');

const createLoader = () => {
  const dappsLoader = dappsLoaderInit();
  const notificationsLoader = notificationsLoaderInit();
  return {
    dappsLoader,
    notificationsLoader
  };
};

module.exports = createLoader