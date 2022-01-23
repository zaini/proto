import React, { useContext } from "react";
import { Heading, Text } from "@chakra-ui/react";
import { Submission } from "../../../../gql-types";
import { ProblemContext } from "../../../../views/Problem/Problem";

type SubmissionsProps = {
  userSubmissions: Submission[];
  latestSubmission: Submission | null;
};

const Submissions = ({
  userSubmissions,
  latestSubmission,
}: SubmissionsProps) => {
  const problem = useContext(ProblemContext);

  return (
    <>
      <Heading>Latest Submission</Heading>
      {JSON.stringify(latestSubmission)}
      <Heading>Your Submissions</Heading>
      {userSubmissions.map((submission: Submission, i: number) => {
        const results = submission.submissionResults;
        return (
          <Text>
            {submission.createdAt} and then some stats about this submission
          </Text>
        );
      })}
    </>
  );
};

export default Submissions;
