const bcrypt = require('bcryptjs');
const  uuid  = require('uuid');
const { ApolloError } = require('apollo-server');

const resolvers = {
  Query: {
      async user (root, { id }, { models }) {
        return models.User.findByPk(id)
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
        return models.DApps.findByPk(uuid)
      },
      async allNotifications (root, args, { models }) {
        return models.Notifications.findAll()
      },
      async notifcations (root, { uuid }, { models }) {
        return models.Notifications.findByPk(uuid)
      },
      async getUserSubscriptions(root, { userUuid, dAppUuid }, { models }) {
        return models.UserNotifications.findAll({
          where: { userUuid, dAppUuid }
        });
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
    async subscribeNotifications(root, { email, dAppUuid, selectedNotifications }, { models }) {
      try {
        const [user, created] = await models.User.findOrCreate({
          raw: true,
          where: { email },
          defaults: {
            uuid: uuid.v4()
          }
        });
        const records = selectedNotifications.map(notification => {
          return {
            uuid: uuid.v4(),
            userUuid: user.uuid,
            dAppUuid: dAppUuid,
            notificationsUuid: notification
          }
        });

        const options = { returning: true, updateOnDuplicate: ['user_uuid', 'd_app_uuid','notifications_uuid'] };
        const userNotifications = await models.UserNotifications.bulkCreate(records, options);
        return userNotifications;
      } catch (error) {
        throw new ApolloError(
          "Create User Notification Error",
          "CREATE_USER_NOTIFICATION_ERROR",
        );
      }

    }, 
    async testEmail(root, { to, apiKey, domain }, { emailUtil }) {
      const testData = {
        to,
        subject: 'TEST',
        text: 'Testing some Mailgun emails!',
        template: "test",
        'h:X-Mailgun-Variables': JSON.stringify({
          "dAppLogo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png",
          "dAppName": "MakerDAO",
          "notifications": [
            {
              "name": "Name 3",
              "shortDesc": "description for Name 3"
            },
            {
              "name": "Name 4",
              "shortDesc": "description for Name 4"
            },
            {
              "name": "Name 5",
              "shortDesc": "description for Name 5"
            }
          ],
          "unsubLink": "#"
        })
      };
      await emailUtil.sendEmail(testData, { apiKey, domain });
      return true;
    }
  },

  DApps: {
    Notifications : async (dapp, args, {dataloader} ) =>  {    
      console.log(`fetching dapp ${dapp.uuid}`)
      const result = dataloader.notificationsLoader.load(dapp.uuid);
      return result;
    }
  },
  Notifications: {
    DApps : async (notification, args, {models, dataloader}) => {
      console.log(`fetching notification ${notification.dAppUuid}`);
      const result = dataloader.dappsLoader.load(notification.dAppUuid);
      return result;
    }
  },
  UserNotifications: {
    DApp: async (userNotifications, args, { models }) => {
      return models.DApps.findByPk(userNotifications.dAppUuid);
    },
    Notification: async (userNotifications, args, { models }) => {
      return models.Notifications.findByPk(userNotifications.notificationsUuid);
    },
    User: (userNotifications, args, { models }) => {
      return models.User.findByPk(userNotifications.userUuid);
    },
  }
}

module.exports = resolvers