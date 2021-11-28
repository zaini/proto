import { prisma } from "../../index";
import { UserInputError } from "apollo-server-errors";
import { createAccessToken, authenticateToken } from "./utils/tokens";
const argon2 = require("argon2");

module.exports = {
  Query: {
    getUsers: () => {
      const users = prisma.user.findMany();
      return users;
    },
    isLoggedIn: (_: any, __: any, context: any) => {
      const authHeader = context.req.headers.authorization as string;
      if (authHeader) {
        const accessToken = authHeader.substring("Bearer ".length);
        return JSON.stringify(authenticateToken(accessToken));
      }
      return false;
    },
  },
  Mutation: {},
};
