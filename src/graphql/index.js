const { ApolloServer } = require('apollo-server');
const { applyMiddleware } = require("graphql-middleware");
const { buildFederatedSchema } = require("@apollo/federation");
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const models = require('../db/models');
const dataloader = require('./dataloaders');
const { Op } = require("sequelize");

const server = new ApolloServer({
  cors: true, 
  schema: applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers }]),
    permissions
  ),
  context: ({ req }) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null;
    return { user,models, Op, dataloader };
  }
})
// server.applyMiddleware()

module.exports = server; 

