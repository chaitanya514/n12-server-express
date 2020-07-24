const bcrypt = require('bcryptjs');
const  uuid  = require('uuid');
const jwt = require("jsonwebtoken");

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
        uuid: uuid.v4(),
        name,
        email,
        password: await bcrypt.hash(password, 10)
      })
    },
    async login(root, args, { models, Op }) {
      console.log('login', args);
      const options = {
        raw: true,
        where: {
          email: {
            [Op.eq]: args.email
          }
        }
      }
      const result = await models.User.findOne(options);
      const {  email, name, password  } = result[0];      
      isValidPassword = await bcrypt.compare(args.password,password) 
       if(isValidPassword) {
         const jwtToken = await jwt.sign(
           { url : "https://localhost:4001/graphql" },
           "f1BtnWgD3VKY",
           { algorithm: "HS256", subject: String(uuid), expiresIn: "1d" }
         );
          return {
            email,
            name,
            jwt: jwtToken
          }
        } else  {
         return {
           email,
           name
         }
      }    
    
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