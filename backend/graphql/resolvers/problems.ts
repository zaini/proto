import {
  MutationCreateProblemArgs,
  TestCaseInput,
  MutationSubmitTestsArgs,
  MutationSubmitProblemArgs,
} from "./../../gql-types.d";
import { ApolloError } from "apollo-server";
import axios, { Method } from "axios";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";
import { getSubmissionStatistics } from "../../utils/problem";
import { LanguageCodeToName } from "../../utils/types";

const JUDGE_API_URL = process.env.JUDGE_API_URL as string;

module.exports = {
  Query: {
    getProblems: async (_: any, __: any, context: any) => {
      logger.info("GraphQL problems/getProblems");
      const problems = await prisma.problem.findMany({
        include: { creator: true, Ratings: true, specification: true },
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
        include: {
          creator: true,
          Ratings: true,
          specification: {
            include: {
              testCases: true,
            },
          },
        },
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
          creator: {
            connect: {
              id: user.id,
            },
          },
          specification: {
            create: {
              title,
              difficulty,
              description,
              initialCode,
              testCases: {
                createMany: {
                  data: testCases.map((testCase) => {
                    return { ...testCase, userId: user.id };
                  }),
                },
              },
            },
          },
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

      const authUser = isAuth(context);

      const testCaseObjects = await prisma.$transaction(
        testCases.map((testCase: TestCaseInput) =>
          prisma.testCase.create({ data: { ...testCase, userId: authUser.id } })
        )
      );

      const testCaseSubmissions = await Promise.all(
        testCaseObjects.map(async (testCase) => {
          const options = {
            method: "POST" as Method,
            url: `${JUDGE_API_URL}/submissions`,
            params: { base64_encoded: "false", fields: "*", wait: true },
            headers: { "content-type": "application/json" },
            data: {
              language_id: language,
              source_code: code,
              stdin: testCase.stdin,
              expected_output: testCase.expectedOutput,
            },
          };

          const response = await axios.request(options);

          const testResult = response.data;

          return await prisma.testCaseSubmission.create({
            data: {
              testCaseId: testCase.id,
              userId: authUser.id,
              description: testResult.status.description,
              passed: testResult.status.description === "Accepted",
              stdout: testResult.stdout ? testResult.stdout : "",
              stderr: testResult.stderr ? testResult.stderr : "",
              time: testResult.time * 1000,
              memory: testResult.memory / 1024,
            },
            include: {
              testCase: true,
            },
          });
        })
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

      const testCaseSubmissions = await Promise.all(
        testCaseObjects.map(async (testCase) => {
          const options = {
            method: "POST" as Method,
            url: `${JUDGE_API_URL}/submissions`,
            params: { base64_encoded: "false", fields: "*", wait: true },
            headers: { "content-type": "application/json" },
            data: {
              language_id: language,
              source_code: code,
              stdin: testCase.stdin,
              expected_output: testCase.expectedOutput,
            },
          };

          const response = await axios.request(options);

          const testResult = response.data;

          return await prisma.testCaseSubmission.create({
            data: {
              testCaseId: testCase.id,
              userId: authUser.id,
              description: testResult.status.description,
              passed: testResult.status.description === "Accepted",
              stdout: testResult.stdout ? testResult.stdout : "",
              stderr: testResult.stderr ? testResult.stderr : "",
              time: testResult.time * 1000,
              memory: testResult.memory / 1024,
            },
          });
        })
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
