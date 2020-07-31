const DataLoader = require('dataloader');
const models = require('../../db/models');

const notificationsLoaderInit = () => {
  return new DataLoader((dAppUuids) => {
    // find all dapps in one query
    return models.Notifications.findAll({
      where: { dAppUuid: dAppUuids }
    })
    // order of returned array should match the order of studentIds
    .then(notifications => {
      const notificationsById = notifications.reduce((value, notification) => {
        if (!value[notification.dAppUuid]) value[notification.dAppUuid] = [];
        value[notification.dAppUuid].push(notification);
        return value;
      }, {});
      return dAppUuids.map(id => {
        return notificationsById[id];
      });
    }).catch(error => {
      console.log(error);
    });
  });
}

module.exports = notificationsLoaderInit;
