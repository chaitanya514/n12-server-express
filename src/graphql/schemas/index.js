const { gql } = require('apollo-server')

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    jwt: String
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
    createUser(name: String!, email: String!, password: String!): User!
    login( email: String!, password: String!): User!
  }
`

module.exports = typeDefs