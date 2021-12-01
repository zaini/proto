import { prisma } from "../../index";
import { logger } from "../../logger";

module.exports = {
  Query: {
    getProblems: () => {},
  },
  Mutation: {
    createProblem: (_: any, data: any, context: any) => {},
  },
};
