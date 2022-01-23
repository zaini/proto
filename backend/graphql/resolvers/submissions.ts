import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";

module.exports = {
  Query: {
    getUserSubmissionsForProblem: async (
      _: any,
      { problemId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/getUserSubmissionsForProblem");
      const user = isAuth(context);
      let submissions = await prisma.submission.findMany({
        where: {
          userId: user.id,
          problemId: parseInt(problemId),
        },
      });

      return submissions;
    },
  },
  Mutation: {},
};
