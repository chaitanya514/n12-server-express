const { rule, shield } = require("graphql-shield");

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const permissions = shield({
  Query: {   
    user: isAuthenticated,
    allDApps: isAuthenticated,
    searchDApps: isAuthenticated,
    dApps: isAuthenticated,
    allNotifications: isAuthenticated,
    notifcations: isAuthenticated    
  },
  DApps: {
    Notifications: isAuthenticated
  },
  Notifications: {
    DApps: isAuthenticated
  }
});

module.exports = { permissions };