import { ApolloError } from "apollo-server";
import axios from "axios";
import {
  MutationSubmitTestsArgs,
  Specification,
  TestCaseResult,
} from "../../gql-types";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";

const JUDGE_API_URL = process.env.JUDGE_API_URL as string;
const TEST_TIMELIMIT = 60 * 1000;
const SUBMISSION_TIMELIMIT = 300 * 1000;

module.exports = {
  Query: {
    getProblems: () => {
      logger.info("GraphQL problems/getProblems");
      const problems = prisma.problem.findMany();
      return problems;
    },
    getProblem: async (_: any, { problemId }: any, context: any) => {
      logger.info("GraphQL problems/getProblem");
      const problem = await prisma.problem.findUnique({
        where: { id: parseInt(problemId) },
        include: { creator: true },
      });
      return problem;
    },
  },
  Mutation: {
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
            time: x.data.time,
            memory: x.data.memory,
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
            time: x.data.time,
            memory: x.data.memory,
          };

          res.push(result);
        })
      );

      const user = isAuth(context);

      const submission = await prisma.submission.create({
        data: {
          userId: user.id,
          problemId: parseInt(problemId),
          submissionResults: res,
          createdAt: new Date(),
        },
      });

      logger.info("Submission results: ", {
        meta: [JSON.stringify(submission)],
      });

      return submission;
    },
  },
};
