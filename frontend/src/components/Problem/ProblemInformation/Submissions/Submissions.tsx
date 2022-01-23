import { Heading } from "@chakra-ui/react";
import React, { useContext } from "react";
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
      <Heading>Latest Submissions</Heading>
      {JSON.stringify(latestSubmission)}
      <Heading>Your Submissions</Heading>
      {userSubmissions.map((submission: Submission, i: number) => {
        const results = submission.submissionResults;
        return (
          <>{submission.createdAt} and then some stats about this submission</>
        );
      })}
    </>
  );
};

export default Submissions;
