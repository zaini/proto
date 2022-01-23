import { Submission } from "@prisma/client";
import { TestCaseResult } from "../../gql-types";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";
import { getSubmissionStatistics } from "../../utils/problem";

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

      if (submissions.length === 0) {
        return [];
      }

      let submissionData = submissions.map(
        (submission: Submission, i: number) => {
          return getSubmissionStatistics(submission);
        }
      );

      return submissionData;
    },
  },
  Mutation: {},
};
