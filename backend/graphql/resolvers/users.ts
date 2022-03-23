import { ApolloError } from "apollo-server";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { authenticateToken } from "../../utils/tokens";
import { isAuth } from "../../utils/isAuth";
import { getUserProblemRatingInformation } from "../../utils/resolverUtils";
import { MutationDeleteUserArgs, QueryGetUserArgs } from "../../gql-types";

module.exports = {
  Query: {
    getUser: async (_: any, { userId }: QueryGetUserArgs, context: any) => {
      logger.info("GraphQL users/getUser");

      // Get user information for profile page

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
          problems: { include: { ratings: true, specification: true } },
          ownedClassrooms: true,
          classrooms: {
            include: {
              classroom: true,
            },
          },
        },
      });

      if (!user) {
        throw new ApolloError("This user does not exist.");
      }

      const dateSixMonthsAgo = new Date();
      dateSixMonthsAgo.setMonth(dateSixMonthsAgo.getMonth() - 6);

      const recentSubmissions = await prisma.submission.findMany({
        where: {
          createdAt: {
            gte: dateSixMonthsAgo,
          },
          userId: parseInt(userId),
        },
        include: {
          problem: { include: { specification: true } },
        },
      });

      return {
        ...user,
        problems: user.problems.map((problem) => {
          return {
            ...problem,
            rating: getUserProblemRatingInformation(null, problem),
          };
        }),
        recentSubmissions,
        classrooms: user.classrooms.map((e) => e.classroom),
      };
    },
    isLoggedIn: (_: any, __: any, context: any) => {
      logger.info("GraphQL users/isLoggedIn");

      // Mostly for testing, checks that auth headers are being sent and validated properly.

      const authHeader = context.req.headers.authorization as string;
      if (authHeader) {
        const accessToken = authHeader.substring("Bearer ".length);
        return JSON.stringify(authenticateToken(accessToken));
      }
      return false;
    },
  },
  Mutation: {
    deleteUser: async (
      _: any,
      { userId, username }: MutationDeleteUserArgs,
      context: any
    ) => {
      logger.info("GraphQL users/deleteUser");

      // Delete a user.
      // Only a user can delete themselves.
      // The DB schema defines the cascading effect.

      const authUser = isAuth(context);

      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      // If user exists and logged in user is that user and the entered username is correct
      if (user && user.id === authUser.id && user.username === username) {
        await prisma.user.delete({
          where: {
            id: user.id,
          },
        });
      } else {
        throw new ApolloError("Failed to delete user.");
      }

      return true;
    },
  },
};
