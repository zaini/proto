import { ApolloError } from "apollo-server";
import axios from "axios";
import {
  MutationCreateProblemArgs,
  MutationSubmitTestsArgs,
  Specification,
  Submission,
  TestCaseResult,
} from "../../gql-types";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";
import { getSubmissionStatistics } from "../../utils/problem";

const JUDGE_API_URL = process.env.JUDGE_API_URL as string;
const TEST_TIMELIMIT = 60 * 1000;
const SUBMISSION_TIMELIMIT = 300 * 1000;

module.exports = {
  Query: {
    getProblems: async (_: any, __: any, context: any) => {
      logger.info("GraphQL problems/getProblems");
      const problems = await prisma.problem.findMany({
        include: { creator: true, Ratings: true },
      });

      const user = isAuth(context);

      const problemsWithSolved = await Promise.all(
        problems.map(async (problem) => {
          const submission = await prisma.submission.findFirst({
            where: {
              userId: user.id,
              problemId: problem.id,
              passed: true,
            },
          });

          const userRating = await prisma.rating.findFirst({
            where: {
              userId: user.id,
              problemId: problem.id,
            },
          });

          return {
            ...problem,
            rating: {
              numberOfRatings: problem.Ratings.length,
              totalRating: problem.Ratings.reduce(
                (total, rating) => rating.score + total,
                0
              ),
              problem,
              ratings: problem?.Ratings,
              userRating,
            },
            solved: submission ? true : false,
          };
        })
      );

      return problemsWithSolved;
    },
    getProblem: async (_: any, { problemId }: any, context: any) => {
      logger.info("GraphQL problems/getProblem");
      const problem = await prisma.problem.findUnique({
        where: { id: parseInt(problemId) },
        include: { creator: true, Ratings: true },
      });

      if (problem) {
        let userRating = {} as any;

        try {
          const user = isAuth(context);
          userRating = await prisma.rating.findFirst({
            where: {
              userId: user.id,
              problemId: problem.id,
            },
          });
        } catch {}

        return {
          ...problem,
          rating: {
            numberOfRatings: problem.Ratings.length,
            totalRating: problem.Ratings.reduce(
              (total, rating) => rating.score + total,
              0
            ),
            problem,
            ratings: problem?.Ratings,
            userRating,
          },
        };
      }

      return null;
    },
  },
  Mutation: {
    createProblem: async (
      _: any,
      { specification }: MutationCreateProblemArgs,
      context: any
    ) => {
      logger.info("GraphQL problems/createProblem");

      const user = isAuth(context);

      const { title, description, testCases, initialCode } = specification;

      if (title === "") {
        throw new ApolloError("Problem name cannot be empty.");
      } else if (description === "") {
        throw new ApolloError("Problem description cannot be empty.");
      } else if (!testCases || (testCases && testCases.length === 0)) {
        throw new ApolloError("Problem must have at least one test case.");
      }
      // TODO add check for initial code stuff

      const problem = await prisma.problem.create({
        data: {
          userId: user.id,
          specification,
        },
      });

      return problem;
    },
    submitTests: async (
      _: any,
      { code, language, testCases }: MutationSubmitTestsArgs,
      context: any
    ) => {
      logger.info("GraphQL problems/submitTests");
      const SUBMISSION_START_TIME = Date.now();

      var axios = require("axios").default;
      let options;
      let res: TestCaseResult[] = [];

      await Promise.all(
        testCases!.map(async (testCase: any) => {
          if (Date.now() - SUBMISSION_START_TIME >= SUBMISSION_TIMELIMIT) {
            console.log("SUBMISSIONS HAVE TIMED OUT");
          }
          options = {
            method: "POST",
            url: `${JUDGE_API_URL}/submissions`,
            params: { base64_encoded: "false", fields: "*" },
            headers: { "content-type": "application/json" },
            data: {
              language_id: language,
              source_code: code,
              stdin: testCase.stdin,
            },
          };

          let submission_token;
          await axios
            .request(options)
            .then(function (response: any) {
              submission_token = response.data.token;
            })
            .catch(function (error: any) {
              logger.error("Error submitting code to Judge0", error);
              return [];
            });

          let time;
          let x;
          while (!time) {
            x = await axios.get(
              `${JUDGE_API_URL}/submissions/${submission_token}`
            );
            time = x.data.time;
          }

          const result: TestCaseResult = {
            id: testCase.id,
            testCase,
            passed: x.data.stdout === testCase.expectedOutput + "\n",
            stdout: x.data.stdout,
            stderr: x.data.stderr,
            time: x.data.time * 1000,
            memory: x.data.memory / 1024,
          };

          res.push(result);
        })
      );
      logger.info("Test case results: ", {
        meta: [JSON.stringify(res)],
      });
      return { results: res };
    },
    submitProblem: async (
      _: any,
      { problemId, code, language }: any,
      context: any
    ) => {
      // This is similar to submitTests but for a specific problem.

      logger.info("GraphQL problems/submitProblem");

      const problem = await prisma.problem.findUnique({
        where: { id: parseInt(problemId) },
      });

      if (!problem) {
        throw new ApolloError("Invalid Problem ID");
      }

      const specification = problem.specification as Specification;
      const testCases = specification.testCases!;

      // TODO refactor this horrid thing both here and in submitTests
      var axios = require("axios").default;
      let options;
      let res: TestCaseResult[] = [];

      await Promise.all(
        testCases.map(async (testCase: any) => {
          options = {
            method: "POST",
            url: `${JUDGE_API_URL}/submissions`,
            params: { base64_encoded: "false", fields: "*" },
            headers: { "content-type": "application/json" },
            data: {
              language_id: language,
              source_code: code,
              stdin: testCase.stdin,
            },
          };

          let submission_token;
          await axios
            .request(options)
            .then(function (response: any) {
              submission_token = response.data.token;
            })
            .catch(function (error: any) {
              logger.error("Error submitting code to Judge0", error);
              return [];
            });

          let time;
          let x;
          while (!time) {
            x = await axios.get(
              `${JUDGE_API_URL}/submissions/${submission_token}`
            );
            time = x.data.time;
          }

          const result: TestCaseResult = {
            id: testCase.id,
            testCase,
            passed: x.data.stdout === testCase.expectedOutput + "\n",
            stdout: x.data.stdout,
            stderr: x.data.stderr,
            time: x.data.time * 1000,
            memory: x.data.memory / 1024,
          };

          res.push(result);
        })
      );

      const user = isAuth(context);

      const submissionResultStats = getSubmissionStatistics(res);

      const submission = await prisma.submission.create({
        data: {
          userId: user.id,
          problemId: parseInt(problemId),
          submissionResults: res,
          createdAt: new Date(),
          language: parseInt(language),
          code: code,
          passed: submissionResultStats.passed,
          avgTime: submissionResultStats.avgTime,
          avgMemory: submissionResultStats.avgMemory,
        },
      });

      logger.info("Submission results: ", {
        meta: [JSON.stringify(submission)],
      });

      return submission;
    },
    rateProblem: async (_: any, { problemId, score }: any, context: any) => {
      logger.info("GraphQL problems/rateProblem");
      const user = isAuth(context);

      const existingRating = await prisma.rating.findUnique({
        where: {
          problemId_userId: {
            problemId: parseInt(problemId),
            userId: user.id,
          },
        },
      });

      if (existingRating) {
        await prisma.rating.update({
          where: {
            problemId_userId: {
              problemId: parseInt(problemId),
              userId: user.id,
            },
          },
          data: {
            score: score,
          },
        });
      } else {
        await prisma.rating.create({
          data: {
            problemId: parseInt(problemId),
            userId: user.id,
            score: score,
          },
        });
      }

      return true;
    },
  },
};
