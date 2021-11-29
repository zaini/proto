import { prisma } from "../../index";
import { logger } from "../../logger";
import { authenticateToken } from "../../utils/tokens";

module.exports = {
  Query: {
    getUsers: () => {
      logger.info("GraphQL users/getUsers");
      const users = prisma.user.findMany();
      return users;
    },
    isLoggedIn: (_: any, __: any, context: any) => {
      logger.info("GraphQL users/isLoggedIn");
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
