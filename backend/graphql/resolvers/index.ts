const usersResolver = require("./users");
const classroomsResolver = require("./classrooms");
const assignmentsResolver = require("./assignments");
const problemsResolver = require("./problems");

module.exports = {
  Query: {
    ...usersResolver.Query,
    ...classroomsResolver.Query,
    ...assignmentsResolver.Query,
    ...problemsResolver.Query,
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...classroomsResolver.Mutation,
    ...assignmentsResolver.Mutation,
    ...problemsResolver.Mutation,
  },
};
