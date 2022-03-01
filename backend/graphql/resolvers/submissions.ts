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

      let submissionsData = submissions.map(
        (submission: Submission, i: number) => {
          return getSubmissionStatistics(submission);
        }
      );

      return submissionsData;
    },
    getSubmissionsForAssignment: async (
      _: any,
      { assignmentId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/getSubmissionsForAssignment");

      // get problems for assignment
      // get submissions for each problem
      // filter for submissions made after assignment was created
      // return each problem with it's associated submissions

      const user = isAuth(context);

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          ProblemsOnAssignments: { include: { problem: true } },
        },
      });

      const problems = assignment?.ProblemsOnAssignments.map((x) => {
        return { ...x.problem };
      });

      return await Promise.all(
        problems!.map(async (problem) => {
          const submissions = await prisma.submission.findMany({
            where: {
              createdAt: {
                gte: assignment?.setDate,
              },
              problemId: problem.id,
              userId: parseInt(user.id),
            },
          });

          const submissionsData = submissions.map(
            (submission: Submission, i: number) => {
              return getSubmissionStatistics(submission);
            }
          );

          return { problem: problem, submissions: submissionsData };
        })
      );
    },
  },
  Mutation: {},
};
