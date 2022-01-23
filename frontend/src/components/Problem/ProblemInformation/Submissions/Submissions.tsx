import React, { useContext } from "react";
import { Heading, Text } from "@chakra-ui/react";
import { Submission, TestCaseResult } from "../../../../gql-types";
import { ProblemContext } from "../../../../views/Problem/Problem";
import CustomTable from "../../../CustomTable/CustomTable";

type SubmissionsProps = {
  userSubmissions: Submission[];
  latestSubmission: Submission | null;
};

const Submissions = ({
  userSubmissions,
  latestSubmission,
}: SubmissionsProps) => {
  const problem = useContext(ProblemContext);

  console.log(latestSubmission);

  return (
    <>
      <Heading>Latest Submission</Heading>
      {latestSubmission
        ? JSON.stringify({
            time: new Date(
              parseInt(latestSubmission.createdAt)
            ).toLocaleString(),
            passed: `${latestSubmission.passed}`,
            avgTime: latestSubmission.avgTime.toFixed(2) + " ms",
            avgMemory: latestSubmission.avgMemory.toFixed(2) + " MB",
            language: latestSubmission.language,
          })
        : "You haven't made a submissions yet."}
      <Heading>Your Submissions</Heading>
      <CustomTable
        data={userSubmissions.map((submission: Submission, i: number) => {
          return {
            time: new Date(parseInt(submission.createdAt)).toLocaleString(),
            passed: `${submission.passed}`,
            avgTime: submission.avgTime.toFixed(2) + " ms",
            avgMemory: submission.avgMemory.toFixed(2) + " MB",
            language: submission.language,
          };
        })}
        columns={[
          {
            Header: "Time",
            accessor: "time",
          },
          {
            Header: "Passed",
            accessor: "passed",
          },
          {
            Header: "Average Time",
            accessor: "avgTime",
          },
          {
            Header: "Average Memory",
            accessor: "avgMemory",
          },
          {
            Header: "Language",
            accessor: "language",
          },
        ]}
      />
    </>
  );
};

export default Submissions;
