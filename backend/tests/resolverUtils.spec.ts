import { Problem, Rating, TestCaseSubmission, User } from "@prisma/client";
import {
  getSubmissionStatistics,
  getUserProblemRatingInformation,
  submitTestCases,
} from "../utils/resolverUtils";

describe("resolverUtils", () => {
  test("getSubmissionStatistics with empty array", async () => {
    const resultsInput: TestCaseSubmission[] = [];

    const result = getSubmissionStatistics(resultsInput);

    const expected = { passed: true, avgTime: NaN, avgMemory: NaN };

    expect(result).toStrictEqual(expected);
  });
  test("getSubmissionStatistics with one failing test case submission", async () => {
    const resultsInput = [
      {
        passed: false,
        time: 5,
        memory: 5,
      },
    ] as TestCaseSubmission[];

    const result = getSubmissionStatistics(resultsInput);

    const expected = { passed: false, avgTime: 5, avgMemory: 5 };

    expect(result).toStrictEqual(expected);
  });
  test("getSubmissionStatistics with one passing test case submission", async () => {
    const resultsInput = [
      {
        passed: true,
        time: 5,
        memory: 5,
      },
    ] as TestCaseSubmission[];

    const result = getSubmissionStatistics(resultsInput);

    const expected = { passed: true, avgTime: 5, avgMemory: 5 };

    expect(result).toStrictEqual(expected);
  });
  test("getSubmissionStatistics with one passing and one failing test case submission", async () => {
    const resultsInput = [
      {
        passed: true,
        time: 5,
        memory: 5,
      },
      {
        passed: false,
        time: 5,
        memory: 5,
      },
    ] as TestCaseSubmission[];

    const result = getSubmissionStatistics(resultsInput);

    const expected = { passed: false, avgTime: 5, avgMemory: 5 };

    expect(result).toStrictEqual(expected);
  });
  test("getUserProblemRatingInformation", async () => {
    const userRating = { score: 1 } as Rating;
    const problem = {
      ratings: [{ score: 5 } as Rating],
    } as Problem & { ratings: Rating[] };

    const result = getUserProblemRatingInformation(userRating, problem);

    const expected = {
      numberOfRatings: 1,
      totalRating: 5,
      problem,
      ratings: problem.ratings,
      userRating,
    };

    expect(result).toMatchObject(expected);
  });
  test("getUserProblemRatingInformation with no ratings for the problem", async () => {
    const userRating = {} as Rating;
    const problem = { ratings: [] as Rating[] } as Problem & {
      ratings: Rating[];
    };

    const result = getUserProblemRatingInformation(userRating, problem);

    const expected = {
      numberOfRatings: 0,
      totalRating: 0,
      problem,
      ratings: problem.ratings,
      userRating,
    };

    expect(result).toMatchObject(expected);
  });
});
