import { Submission } from "@prisma/client";
import { ApolloError } from "apollo-server";
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
    getAssignmentSubmissions: async (
      _: any,
      { assignmentId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/getAssignmentSubmissions");

      const user = isAuth(context);

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          ProblemsOnAssignments: { include: { problem: true } },
        },
      });

      if (assignment) {
        const problems = assignment?.ProblemsOnAssignments.map((x) => {
          return { ...x.problem };
        });

        const x = await Promise.all(
          problems.map(async (problem) => {
            const assignmentSubmission =
              await prisma.assignmentSubmission.findUnique({
                where: {
                  userId_assignmentId_problemId: {
                    userId: parseInt(user.id),
                    problemId: problem.id,
                    assignmentId: assignment.id,
                  },
                },
                include: {
                  submission: true,
                  user: true,
                  problem: true,
                },
              });

            return { problem, ...assignmentSubmission };
          })
        );
        return x;
      }

      return [];
    },
  },
  Mutation: {
    setAssignmentSubmissions: async (
      _: any,
      { assignmentId, submissionId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/setAssignmentSubmissions");
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

      const submission = await prisma.submission.findUnique({
        where: {
          id: parseInt(submissionId),
        },
        include: {
          user: true,
          problem: true,
        },
      });

      // TODO check if a submission for this problem was already done

      if (submission && assignment) {
        try {
          await prisma.assignmentSubmission.delete({
            where: {
              userId_assignmentId_problemId: {
                userId: submission.userId,
                problemId: submission.problemId,
                assignmentId: assignment.id,
              },
            },
          });
        } catch (error) {}

        if (problems?.some((problem) => problem.id === submission.problemId)) {
          const assignmentSubmission = await prisma.assignmentSubmission.create(
            {
              data: {
                userId: submission.userId,
                problemId: submission.problemId,
                assignmentId: assignment.id,
                submissionId: submission.id,
                createdAt: new Date(),
              },
            }
          );

          return true;
        } else {
          throw new ApolloError(
            "The problem this submission solves is not part of this assignment."
          );
        }
      }

      return false;
    },
  },
};
