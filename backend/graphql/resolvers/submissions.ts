import { ApolloError } from "apollo-server";
import {
  TestCaseInput,
  MutationSubmitTestsArgs,
  MutationSubmitProblemArgs,
} from "./../../gql-types.d";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";
import {
  getSubmissionStatistics,
  submitTestCases,
} from "../../utils/resolverUtils";

module.exports = {
  Query: {
    getSubmissionsForProblem: async (
      _: any,
      { problemId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/getSubmissionsForProblem");

      // Get all submissions from user for a problem.
      // Used when viewing submissions on a problem.

      const user = isAuth(context);

      const problem = await prisma.problem.findUnique({
        where: {
          id: parseInt(problemId),
        },
      });

      if (!problem) {
        throw new ApolloError("This problem does not exist.");
      }

      const submissions = await prisma.submission.findMany({
        where: {
          userId: user.id,
          problemId: problem.id,
        },
      });

      return submissions;
    },
    getSubmission: async (_: any, { submissionId }: any, context: any) => {
      logger.info("GraphQL submissions/getSubmission");

      // Gets a specific submission to be view.
      // Anyone can view a submission.

      const submission = await prisma.submission.findUnique({
        where: {
          id: parseInt(submissionId),
        },
        include: {
          testCaseSubmissions: {
            include: {
              testCase: true,
            },
          },
        },
      });

      if (submission) {
        return submission;
      }

      throw new ApolloError("Could not find submission with that ID.");
    },
    getAssignmentProblemSubmissions: async (
      _: any,
      { assignmentId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/getAssignmentProblemSubmissions");

      // Returns the submissions made for the problems in an assignment

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
          problems: {
            include: {
              problem: {
                include: {
                  specification: true,
                },
              },
            },
          },
        },
      });

      if (!assignment) {
        throw new ApolloError("Assignment does not exist.");
      }

      const problems = assignment.problems.map((e) => e.problem);

      // Map each problem in the assignment to the submissions made
      const problemSubmissionsMap = await Promise.all(
        problems.map(async (problem) => {
          const submissions = await prisma.submission.findMany({
            where: {
              createdAt: {
                gte: assignment?.setDate,
              },
              problemId: problem.id,
              userId: parseInt(user.id),
            },
            include: {
              problem: { include: { specification: true } },
            },
          });

          return { problem, submissions };
        })
      );

      return problemSubmissionsMap;
    },
    getAssignmentSubmissions: async (
      _: any,
      { assignmentId, userId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/getAssignmentSubmissions");

      // Gets the AssignmentSubmission for an assignment.

      // TODO add validation based on how this is used
      if (!userId) {
        const user = isAuth(context);
        userId = user.id;
      }

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          problems: {
            include: {
              problem: {
                include: {
                  specification: true,
                },
              },
            },
          },
        },
      });

      if (!assignment) {
        throw new ApolloError("Assignment does not exist.");
      }

      const problems = assignment.problems.map((e) => e.problem);

      const assignmentSubmission = await Promise.all(
        problems.map(async (problem) => {
          const assignmentSubmission =
            await prisma.assignmentSubmission.findUnique({
              where: {
                userId_assignmentId_problemId: {
                  userId: parseInt(userId),
                  problemId: problem.id,
                  assignmentId: assignment.id,
                },
              },
              include: {
                submission: true,
                problem: {
                  include: {
                    specification: true,
                  },
                },
              },
            });
          if (assignmentSubmission) {
            return assignmentSubmission;
          } else {
            return { problem };
          }
        })
      );

      return assignmentSubmission;
    },
    getAssignmentSubmissionsAsTeacher: async (
      _: any,
      { assignmentId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/getAssignmentSubmissionsAsTeacher");

      // Used by teacher to view all the assignment submissions on a table

      const user = isAuth(context);

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          problems: { include: { problem: true } },
          classroom: { include: { creator: true } },
        },
      });

      if (!assignment) {
        throw new ApolloError("This assignment does not exist.");
      }

      // Only the creator of the classroom for the assignment can view all the submissions
      // TODO uncomment this
      // if (assignment.classroom.creator.id != user.id) {
      //   throw new ApolloError(
      //     "This user is the not the creator of this assignment."
      //   );
      // }

      const learners = await prisma.usersOnClassrooms.findMany({
        where: {
          classroomId: assignment.classroomId,
        },
        include: {
          user: true,
        },
      });

      const userAssignmentSubmission = await Promise.all(
        learners.map(async ({ user }) => {
          const assignmentSubmissions =
            await prisma.assignmentSubmission.findMany({
              where: {
                userId: user.id,
                assignmentId: assignment.id,
              },
              include: {
                submission: true,
              },
            });
          return { user, assignmentSubmissions };
        })
      );

      return userAssignmentSubmission;
    },
  },
  Mutation: {
    setAssignmentProblemSubmission: async (
      _: any,
      { assignmentId, submissionId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/setAssignmentProblemSubmission");

      // Used by student to set their submission for a problem in an assignment

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          problems: { include: { problem: true } },
        },
      });

      if (!assignment) {
        throw new ApolloError("This assignment does not exist.");
      }

      // TODO check if a submission for this problem was already done
      const submission = await prisma.submission.findUnique({
        where: {
          id: parseInt(submissionId),
        },
        include: {
          user: true,
          problem: true,
        },
      });

      if (!submission) {
        throw new ApolloError("Submission does not exist.");
      }

      const problems = assignment.problems.map((e) => e.problem);

      if (!problems) {
        // This error shouldn't occur since we validate when problems are created.
        throw new ApolloError("This assignment has no problems.");
      }

      if (problems.some((problem) => problem.id === submission.problemId)) {
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
        } catch (error) {
          // throw new ApolloError(error as string);
        }

        const assignmentSubmission = await prisma.assignmentSubmission.create({
          data: {
            userId: submission.userId,
            problemId: submission.problemId,
            assignmentId: assignment.id,
            submissionId: submission.id,
            createdAt: new Date(),
          },
        });

        return assignmentSubmission;
      } else {
        throw new ApolloError(
          "The problem this submission solves is not part of this assignment."
        );
      }
    },
    removeAssignmentProblemSubmission: async (
      _: any,
      { assignmentId, problemId }: any,
      context: any
    ) => {
      logger.info("GraphQL submissions/removeAssignmentProblemSubmission");

      // Removes an assignment submission

      const user = isAuth(context);

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          problems: { include: { problem: true } },
        },
      });

      if (!assignment) {
        throw new ApolloError("This assignment does not exist");
      }
      try {
        await prisma.assignmentSubmission.delete({
          where: {
            userId_assignmentId_problemId: {
              userId: user.id,
              problemId: parseInt(problemId),
              assignmentId: assignment.id,
            },
          },
        });
        return true;
      } catch (error) {
        throw new ApolloError(
          "Could not delete your submission for this assignment problem. It might not exist."
        );
      }
    },
    submitTests: async (
      _: any,
      { code, language, testCases }: MutationSubmitTestsArgs,
      context: any
    ) => {
      logger.info("GraphQL problems/submitTests");

      const authUser = isAuth(context);

      const testCaseObjects = await prisma.$transaction(
        testCases.map((testCase: TestCaseInput) =>
          prisma.testCase.create({ data: { ...testCase, userId: authUser.id } })
        )
      );

      const testCaseSubmissions = await submitTestCases(
        authUser,
        language,
        code,
        testCaseObjects
      );

      // Deleting the test case submission and test cases that were created.
      // They were made because they're convinent objects but they are not required to stay since we don't show these test cases anywhere.
      // We only keep TestCaseSubmissions for actual Submissions.
      await prisma.testCaseSubmission.deleteMany({
        where: {
          id: {
            in: testCaseSubmissions.map((e) => e.id),
          },
        },
      });

      await prisma.testCase.deleteMany({
        where: {
          id: {
            in: testCaseObjects.map((e) => e.id),
          },
        },
      });

      logger.info("Test Case Submission results: ", {
        meta: [JSON.stringify(testCaseSubmissions)],
      });

      return testCaseSubmissions;
    },
    submitProblem: async (
      _: any,
      { problemId, code, language }: MutationSubmitProblemArgs,
      context: any
    ) => {
      logger.info("GraphQL problems/submitProblem");

      const authUser = isAuth(context);

      const problem = await prisma.problem.findUnique({
        where: { id: parseInt(problemId) },
        include: {
          specification: {
            include: {
              testCases: true,
            },
          },
        },
      });

      if (!problem) {
        throw new ApolloError("This problem does not exist.");
      }

      const testCaseObjects = problem.specification.testCases;

      const testCaseSubmissions = await submitTestCases(
        authUser,
        language,
        code,
        testCaseObjects
      );

      const submissionStats = getSubmissionStatistics(
        testCaseSubmissions as any
      );

      const submission = await prisma.submission.create({
        data: {
          userId: authUser.id,
          problemId: problem.id,
          createdAt: new Date(),
          language,
          code,
          passed: submissionStats.passed,
          avgTime: submissionStats.avgTime,
          avgMemory: submissionStats.avgMemory,
        },
      });

      await prisma.$transaction(
        testCaseSubmissions.map((testCaseSubmission) =>
          prisma.testCaseSubmission.update({
            where: { id: testCaseSubmission.id },
            data: { submissionId: submission.id },
          })
        )
      );

      logger.info("Submission results: ", {
        meta: [JSON.stringify(submission)],
      });

      return submission;
    },
  },
};
