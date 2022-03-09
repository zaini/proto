import React, { useContext } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Assignment, UserAssignmentSubmission } from "../../../gql-types";
import { AssignmentContext } from "../../../views/Dashboard/Classrooms/Classroom/Assignment/Assignment";
import SubmissionModalStatistics from "../../SubmissionModal/SubmissionModalStatistics/SubmissionModalStatistics";

type Props = {
  userAssignmentSubmission: UserAssignmentSubmission;
};

const AssignmentSubmissionModalStatistics = ({
  userAssignmentSubmission,
}: Props) => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  const user = userAssignmentSubmission.user;
  const assignmentSubmissions = userAssignmentSubmission.assignmentSubmission;

  const numOfProblems = assignment.problems?.length;

  const attempts = assignmentSubmissions?.length;

  const solves = assignmentSubmissions?.filter(
    (assignmentSubmission) => assignmentSubmission?.submission?.passed
  ).length;

  const lastChange = Math.max.apply(
    Math,
    assignmentSubmissions!.map((o) => {
      return o?.submission?.createdAt
        ? parseInt(o?.submission?.createdAt)
        : -Infinity;
    })
  );

  return (
    <>
      {/* {JSON.stringify(assignmentSubmission)} */}
      {/* TODO show problem information and navigation to view code */}
      {JSON.stringify({
        learner: user.username,
        attempted: `${attempts}/${numOfProblems}`,
        solved: `${solves}/${numOfProblems}`,
        lastChange:
          lastChange === -Infinity
            ? "N/A"
            : new Date(lastChange).toLocaleString(),
      })}

      <Box>
        {assignmentSubmissions?.map((assignmentSubmission) => {
          const problem = assignmentSubmission?.problem;
          const submission = assignmentSubmission?.submission;
          if (submission) {
            return <SubmissionModalStatistics submission={submission} />;
          }
          return <Text>No submission made for this problem</Text>;
        })}
      </Box>
    </>
  );
};

export default AssignmentSubmissionModalStatistics;
