import { ApolloError } from "apollo-server";
import {
  Problem,
  Rating,
  TestCase,
  User,
  TestCaseSubmission,
} from "@prisma/client";
import axios, { Method } from "axios";
import { prisma } from "../index";
import { LanguageCodeToName } from "./types";

const JUDGE_API_URL = process.env.JUDGE_API_URL as string;

const getSubmissionStatistics = (results: TestCaseSubmission[]) => {
  const N = results.length;

  let status = true;
  let totalTime = 0;
  let totalMemory = 0;

  results!.forEach((result: TestCaseSubmission) => {
    status = status && result.passed;
    totalTime += parseFloat(`${result.time}`);
    totalMemory += result.memory!;
  });

  let avgTime = totalTime / N;
  let avgMemory = totalMemory / N;

  return {
    passed: status,
    avgTime,
    avgMemory,
  };
};

const getUserProblemRatingInformation = (
  userRating: Rating | null,
  problem: Problem & { ratings: Rating[] }
) => {
  return {
    numberOfRatings: problem.ratings.length,
    totalRating: problem.ratings.reduce(
      (total, rating) => rating.score + total,
      0
    ),
    problem,
    ratings: problem.ratings,
    userRating,
  };
};

const submitTestCases = async (
  user: User,
  language: number,
  code: string,
  testCases: TestCase[]
): Promise<
  (TestCaseSubmission & {
    testCase: TestCase;
  })[]
> => {
  if (!(language in LanguageCodeToName)) {
    throw new ApolloError("This language is not supported.");
  }
  if (testCases.length === 0) {
    throw new ApolloError("Cannot submit tests without test cases.");
  }

  const res = await Promise.all(
    testCases.map(async (testCase) => {
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
          userId: user.id,
          description: testResult.status.description,
          compile_output: testResult.compile_output
            ? testResult.compile_output
            : "",
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
  return res;
};

export {
  getSubmissionStatistics,
  getUserProblemRatingInformation,
  submitTestCases,
};
