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
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Link,
  Spinner,
} from "@chakra-ui/react";
import CustomTable from "../../../../../../components/CustomTable/CustomTable";

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
          <Box my={4}>
            <Heading>Current submission for this assignment</Heading>
            <CustomTable
              data={assignmentSubmissions.map((x: AssignmentSubmission) => {
                const problem = x.problem;
                const submission = x.submission;

                return {
                  id: problem.id,
                  problemName: problem.specification.title,
                  submission: submission ? "" + submission.id : "N/A",
                  passed: submission ? "" + submission.passed : "N/A",
                  options: (
                    <ButtonGroup>
                      <Button
                        isDisabled={submission === null}
                        colorScheme={"blue"}
                      >
                        {submission
                          ? "Remove as submission for this problem"
                          : "You must set a submission for this problem"}
                      </Button>
                    </ButtonGroup>
                  ),
                };
              })}
              columns={[
                {
                  Header: "ID",
                  accessor: "id",
                },
                {
                  Header: "Passed",
                  accessor: "passed",
                },
                {
                  Header: "Problem",
                  accessor: "problemName",
                },
                {
                  Header: "Submission",
                  accessor: "submission",
                },
                {
                  Header: "Options",
                  accessor: "options",
                },
              ]}
            />
          </Box>
          {problemSubmissions.map(
            (x: AssignmentProblemSubmissions, i: number) => {
              const problem = x.problem;
              const submissions = x.submissions;

              return (
                <Box key={problem.id}>
                  <Heading>
                    Problem: #{problem.id} {problem.specification.title}
                  </Heading>
                  <Button
                    as={Link}
                    href={`/problems/${problem.id}`}
                    target={"_blank"}
                    colorScheme={"blue"}
                  >
                    Go to problem
                  </Button>

                  <Box mt={4}>
                    {submissions ? (
                      <CustomTable
                        data={submissions.map((submission: Submission) => {
                          return {
                            id: submission.id,
                            passed: "" + submission.passed,
                            options: (
                              <ButtonGroup>
                                <Button colorScheme={"blue"}>
                                  View Submission
                                </Button>
                                <Button colorScheme={"blue"}>
                                  Set as submission for this problem
                                </Button>
                              </ButtonGroup>
                            ),
                          };
                        })}
                        columns={[
                          {
                            Header: "ID",
                            accessor: "id",
                          },
                          {
                            Header: "Passed",
                            accessor: "passed",
                          },
                          {
                            Header: "Options",
                            accessor: "options",
                          },
                        ]}
                      />
                    ) : (
                      <Heading textAlign={"center"}>
                        You have not made any submissions for this problem
                      </Heading>
                    )}
                  </Box>
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
