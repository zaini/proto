import {
  MutationCreateProblemArgs,
  MutationSubmitTestsArgs,
  TestCaseSubmission,
} from "./../../gql-types.d";
import { ApolloError } from "apollo-server";
import axios, { Method } from "axios";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";
import { getSubmissionStatistics } from "../../utils/problem";
import { LanguageCodeToName } from "../../utils/types";

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
    getDefaultInitialCodes: async (_: any, __: any, context: any) => {
      logger.info("GraphQL problems/getDefaultInitialCodes");

      // 71: "Python (3.8.1)",
      // 36: "Python (2.7.9)",
      // 63: "JavaScript (Node.js 12.14.0)",
      // 74: "TypeScript (3.7.4)",
      // 28: "Java 7",
      // 27: "Java 8",

      return JSON.stringify({
        71: `#!/bin/python3

def add(a, b):
  return a + b

if __name__ == "__main__":
  stdin = input()
  a, b = stdin.split()
  a, b = int(a), int(b)
  print(add(a, b))`,
        36: `def add(a, b):
  return a + b

if __name__ == "__main__":
  stdin = raw_input()
  a, b = stdin.split()
  a, b = int(a), int(b)
  print add(a, b)`,
        63: `const add = (a, b) => {
  return a + b;
}

process.stdin.on("data", buffer => {
  const ab = (buffer + "").split(" ");
  const a = parseInt(ab[0]);
  const b = parseInt(ab[1]);
  console.log(add(a, b));
});`,
        28: `java 7`,
        27: `java 8`,
      });
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

      const { title, description, testCases, initialCode, difficulty } =
        specification;

      const newSpecification = await prisma.specification.create({
        data: specification,
      });

      const initialCodeObj = JSON.parse(initialCode);

      if (title === "") {
        throw new ApolloError("Problem name cannot be empty.");
      } else if (description === "") {
        throw new ApolloError("Problem description cannot be empty.");
      } else if (!testCases || (testCases && testCases.length === 0)) {
        throw new ApolloError("Problem must have at least one test case.");
      } else if (
        Object.keys(initialCodeObj).length === 0 ||
        Object.keys(initialCodeObj).some(
          (code) => !(parseInt(code) in LanguageCodeToName)
        )
      ) {
        throw new ApolloError("Problem must use at least one valid language.");
      }

      const problem = await prisma.problem.create({
        data: {
          userId: user.id,
          specificationId: newSpecification.id,
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
      let res: TestCaseSubmission[] = [];

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

          const result: TestCaseSubmission = {
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
      logger.info("GraphQL problems/submitProblem");

      const user = isAuth(context);

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
        throw new ApolloError("Invalid Problem ID");
      }

      const specification = problem.specification;
      const testCases = specification.testCases;

      let res: TestCaseSubmission[] = [];

      const options = {
        method: "POST" as Method,
        url: `${JUDGE_API_URL}/submissions/batch`,
        params: { base64_encoded: "false", fields: "*" },
        headers: { "content-type": "application/json" },
        data: {
          submissions: testCases.map((testCase) => {
            return {
              language_id: language,
              source_code: code,
              stdin: testCase.stdin,
              expected_output: testCase.expectedOutput,
              callback_url: "http://172.17.0.1:5000/submission",
            };
          }),
        },
      };

      let tokens: string[] = [];
      try {
        const response = await axios.request(options);
        const tokenArray: { token: string }[] = response.data;
        tokens = tokenArray.reduce((r: any, obj) => r.concat(obj.token), []);
      } catch (error) {
        logger.error("Error submitting code to Judge0", error);
        return [];
      }

      console.log("submission_tokens", tokens);

      const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
      await delay(5000);

      try {
        const results = await axios.get(
          `${JUDGE_API_URL}/submissions/${tokens[0]}`,
          {
            params: { base64_encoded: "false", fields: "*" },
          }
        );

        console.log("results", results.data);

        // const result: TestCaseResult = {
        //   id: testCase.id,
        //   testCase,
        //   passed: results.data.stdout === testCase.expectedOutput + "\n",
        //   stdout: results.data.stdout,
        //   stderr: results.data.stderr,
        //   time: results.data.time * 1000,
        //   memory: results.data.memory / 1024,
        // };

        // res.push(result);

        // const submissionResultStats = getSubmissionStatistics(res);

        // const submission = await prisma.submission.create({
        //   data: {
        //     userId: user.id,
        //     problemId: parseInt(problemId),
        //     submissionResults: res,
        //     createdAt: new Date(),
        //     language: parseInt(language),
        //     code: code,
        //     passed: submissionResultStats.passed,
        //     avgTime: submissionResultStats.avgTime,
        //     avgMemory: submissionResultStats.avgMemory,
        //   },
        // });
        const submission = {};
        logger.info("Submission results: ", {
          meta: [JSON.stringify(submission)],
        });

        return submission;
      } catch (error) {
        logger.error("Error getting submissions from Judge0", error);
        return [];
      }
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
