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
          problem: {
            include: {
              specification: true,
            },
          },
        },
      });

      if (submission) {
        return submission;
      }

      throw new ApolloError("Could not find submission with that ID.");
    },
  },
  Mutation: {
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
