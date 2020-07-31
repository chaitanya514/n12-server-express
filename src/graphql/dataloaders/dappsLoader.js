const DataLoader = require('dataloader');
const models = require('../../db/models');

const dappsLoaderInit = () => {
  return new DataLoader((dAppUuids) => {
    return models.DApps.findAll({
      where: { uuid: dAppUuids }
    })
    .then(dapps => {
      const dappsById = dapps.reduce((value, dapp) => {
        if (!value[dapp.uuid]) value[dapp.uuid] = [];
        value[dapp.uuid].push(dapp);
        return value;
      }, {});
      return dAppUuids.map(id => {
        return dappsById[id];
      });
    });
  });  
}

module.exports = dappsLoaderInit;
    
// return dappLoader.load(notification.dAppUuid);