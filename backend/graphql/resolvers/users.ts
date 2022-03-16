import { ApolloError } from "apollo-server";
import { Prisma, UsersOnClassrooms } from ".prisma/client";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { authenticateToken } from "../../utils/tokens";

module.exports = {
  Query: {
    getUsers: async () => {
      logger.info("GraphQL users/getUsers");
      let users = await prisma.user.findMany({
        include: {
          problems: true,
          classrooms: true,
          UsersOnClassrooms: { include: { classroom: true } },
        },
      });

      const parsedUsers = users.map((user) => {
        const classroomsUsersIsIn = user.UsersOnClassrooms.map(
          (x) => x.classroom
        );
        return { ...user, UsersOnClassrooms: classroomsUsersIsIn };
      });

      return parsedUsers;
    },
    getUser: async (_: any, { userId }: any, context: any) => {
      let user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
          problems: { include: { Ratings: true } },
          classrooms: true,
          UsersOnClassrooms: {
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
          problem: true,
        },
      });

      return {
        ...user,
        problems: user.problems.map((problem) => {
          return {
            ...problem,
            rating: {
              numberOfRatings: problem.Ratings.length,
              totalRating: problem.Ratings.reduce(
                (total: any, rating: any) => rating.score + total,
                0
              ),
            },
          };
        }),
        recentSubmissions,
        UsersOnClassrooms: user?.UsersOnClassrooms.map((e) => e.classroom),
      };
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
  Mutation: {
    // Users are currently made directly from the backend when authenticating GitHub, not from GraphQL
  },
};
