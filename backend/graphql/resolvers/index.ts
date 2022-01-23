const usersResolver = require("./users");
const classroomsResolver = require("./classrooms");
const assignmentsResolver = require("./assignments");
const problemsResolver = require("./problems");
const submissionsResolver = require("./submissions");

module.exports = {
  Query: {
    ...usersResolver.Query,
    ...classroomsResolver.Query,
    ...assignmentsResolver.Query,
    ...problemsResolver.Query,
    ...submissionsResolver.Query,
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...classroomsResolver.Mutation,
    ...assignmentsResolver.Mutation,
    ...problemsResolver.Mutation,
    ...submissionsResolver.Mutation,
  },
};
