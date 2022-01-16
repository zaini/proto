const userResolver = require("./users");
const problemResolver = require("./problems");

module.exports = {
  Query: {
    ...userResolver.Query,
    ...problemResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...problemResolver.Mutation,
  },
};
