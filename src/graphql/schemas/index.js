const { gql } = require('apollo-server')

const typeDefs = gql`
  type User {
    uuid: String!
    email: String!
  }

  type DApps {
    uuid: String!
    name: String!
    description: String!
    logoUrl: String!
    Notifications: [Notifications!]
  }

  type Notifications {
    uuid: String!
    dAppUuid: String!
    name: String!
    shortDescription: String!
    longDescription: String!
    DApps: [DApps!]
  }

  type Query {
    user(id: Int!): User
    allDApps: [DApps!]!
    searchDApps(searchLike: String!): [DApps!]!
    dApps(uuid: String!): DApps
    allNotifications: [Notifications!]!
    notifcations(uuid: String!): Notifications
  }

  type Mutation {
    createUser(email: String!): User!
  }
`

module.exports = typeDefs