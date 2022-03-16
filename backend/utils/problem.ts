import { TestCaseSubmission } from "../gql-types";

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

export { getSubmissionStatistics };
