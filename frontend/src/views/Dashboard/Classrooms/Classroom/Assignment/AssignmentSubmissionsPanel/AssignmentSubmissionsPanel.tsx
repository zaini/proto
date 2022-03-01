import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../../context/Auth";
import {
  Assignment,
  AssignmentProblemSubmissions,
  AssignmentSubmission,
  Submission,
} from "../../../../../../gql-types";
import { AccountType } from "../../../../../../utils";
import { AssignmentContext } from "../Assignment";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";
import { Box, Center, List, ListItem, Spinner } from "@chakra-ui/react";

const GET_CURRENT_SUBMISSION = gql`
  query getAssignmentSubmissions($assignmentId: ID!) {
    getAssignmentSubmissions(assignmentId: $assignmentId) {
      problem {
        id
        specification {
          title
        }
      }
      submission {
        id
        passed
        avgTime
        avgMemory
        language
        createdAt
        submissionResults {
          passed
        }
      }
    }
  }
`;

const GET_ASSIGNMENT_SUBMISSIONS = gql`
  query getSubmissionsForAssignment($assignmentId: ID!) {
    getSubmissionsForAssignment(assignmentId: $assignmentId) {
      problem {
        id
        specification {
          title
        }
      }
      submissions {
        id
        passed
        avgTime
        avgMemory
        language
        createdAt
        submissionResults {
          passed
        }
      }
    }
  }
`;

const AssignmentSubmissionsPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  const { accountType }: any = useContext(AuthContext);

  const [assignmentSubmissions, setAssignmentSubmissions] = useState<
    AssignmentSubmission[]
  >([]);

  const [problemSubmissions, setProblemSubmissions] = useState<
    AssignmentProblemSubmissions[]
  >([]);

  const [
    getAssignmentSubmissions,
    {
      loading: currentSubmissionLoading,
      error: currentSubmissionError,
      data: currentSubmissionData,
    },
  ] = useLazyQuery(GET_CURRENT_SUBMISSION, {
    onCompleted: ({ getAssignmentSubmissions }) => {
      setAssignmentSubmissions(getAssignmentSubmissions);
    },
    variables: {
      assignmentId: assignment.id,
    },
  });

  const [getProblemSubmissions, { loading, error, data }] = useLazyQuery(
    GET_ASSIGNMENT_SUBMISSIONS,
    {
      onCompleted: ({ getSubmissionsForAssignment }) => {
        setProblemSubmissions(getSubmissionsForAssignment);
      },
      variables: {
        assignmentId: assignment.id,
      },
    }
  );

  useEffect(() => {
    getAssignmentSubmissions();
    getProblemSubmissions();
  }, []);

  if (loading)
    return (
      <Center h="1000px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  // TODO have an actual error page and log this
  if (error) return <>Error! ${error.message}</>;

  console.log(assignmentSubmissions);

  return (
    <>
      all submissions {assignment.id}
      {accountType === AccountType.Teacher ? (
        <p>
          teacher sees a list of all students and their submissions or lack of
          submission with some basic stats. they can click on the submission to
          open a modal with details about the submission including the code.
        </p>
      ) : (
        <>
          students see list of the submissions to the problem since the creation
          of the assignment and they can assign any of their submissions to be
          the submission for each problem in the assignment. they can change
          this any time.
          <br />
          Current submission:
          <br />
          <List>
            {assignmentSubmissions.map((x: AssignmentSubmission) => {
              const problem = x.problem;
              const submission = x.submission;
              return (
                <ListItem key={problem.id}>
                  {submission ? (
                    <>
                      {submission.id} {"" + submission.passed}
                    </>
                  ) : (
                    "no submission made"
                  )}
                </ListItem>
              );
            })}
          </List>
          <br />
          <br />
          {problemSubmissions.map(
            (x: AssignmentProblemSubmissions, i: number) => {
              const problem = x.problem;
              const submissions = x.submissions;

              return (
                <Box key={problem.id}>
                  Problem: # {problem.id} {problem.specification.title}
                  <br />
                  Submissions:
                  <br />
                  <List>
                    {submissions?.map((submission: Submission) => {
                      return (
                        <ListItem key={submission.id}>
                          {submission.id} {"" + submission.passed}
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              );
            }
          )}
        </>
      )}
    </>
  );
};

export default AssignmentSubmissionsPanel;
