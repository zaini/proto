import { TestCaseResult } from "../gql-types";

const getSubmissionStatistics = (submission: any) => {
  const results = submission.submissionResults as TestCaseResult[];

  const N = results.length;

  let status = true;
  let totalTime = 0;
  let totalMemory = 0;

  results!.forEach((result: TestCaseResult, j: number) => {
    status = status && result.passed;
    totalTime += parseFloat(`${result.time}`);
    totalMemory += result.memory!;
  });

  let avgTime = totalTime / N;
  let avgMemory = totalMemory / N;

  return {
    ...submission,
    passed: status,
    avgTime,
    avgMemory,
  };
};

export { getSubmissionStatistics };
