import { prisma } from "../../index";
import { logger } from "../../logger";

module.exports = {
  Query: {
    getProblems: () => {
      logger.info("GraphQL users/getProblems");
      const problems = prisma.problem.findMany();
      return problems;
    },
    getProblem: async (_: any, { problemId }: any, context: any) => {
      const problem = await prisma.problem.findUnique({
        where: { id: parseInt(problemId) },
        include: { creator: true },
      });
      return problem;
    },
  },
  Mutation: {},
};
