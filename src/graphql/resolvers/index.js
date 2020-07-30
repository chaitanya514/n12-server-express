const bcrypt = require('bcryptjs');
const  uuid  = require('uuid');
const resolvers = {
  Query: {
      async user (root, { id }, { models }) {
        return models.User.findById(id)
      },
      async allDApps (root, args, { models }) {
        return models.DApps.findAll();
      },
      async searchDApps (root, args, { models, Op }) {
        const options = {
          where : {
            [Op.or]: [
              {name: {[Op.iLike] : `%${args.searchLike}%` }}, 
              {description: {[Op.iLike] : `%${args.searchLike}%` }}
            ]
          }
        }

        const result = await models.DApps.findAll(options);

        return result;
      },
      async dApps (root, { uuid }, { models }) {
        return models.DApps.findById(uuid)
      },
      async allNotifications (root, args, { models }) {
        return models.Notifications.findAll()
      },
      async notifcations (root, { uuid }, { models }) {
        return models.Notifications.findById(uuid)
      }      
    },

  Mutation: {
    async createUser (root, { name, email, password }, { models }) {
      return models.User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10)
      })
    },
    async subscribeNotificcations (root, { email, dAppUuid, selectedNotifications }, { models }) {
     
      const [user,created] = await models.User.findOrCreate({
        raw:true,
        where: { email },
        defaults: {
          uuid: uuid.v1()
        }
      });
      const records = selectedNotifications.map(notification => {
        return {
          uuid: uuid.v1(),
          userUuid: user.uuid,
          dAppUuid: dAppUuid,
          notificationsUuid: notification
        }
      });
      const options = { returning: true };
      const userNotifications = await models.UserNotifications.bulkCreate(records, options);
      return userNotifications;
    }
  },

  DApps: {
    Notifications : async (dapp, args, {dataloader} ) =>  {    
      console.log(`fetching dapp ${dapp.uuid}`)
      const result = dataloader.notificationsLoader.load(dapp.uuid);
      // dataloader.notificationsLoader.clear(dapp.uuid);
      return result;
    }
  },
  Notifications: {
    DApps : async (notification, args, {models, dataloader}) => {
      console.log(`fetching notification ${notification.dAppUuid}`);
      const result = dataloader.dappsLoader.load(notification.dAppUuid);
      // dataloader.dappsLoader.clear(notification.dAppUuid);
      return result;
    }
  }
}

module.exports = resolvers