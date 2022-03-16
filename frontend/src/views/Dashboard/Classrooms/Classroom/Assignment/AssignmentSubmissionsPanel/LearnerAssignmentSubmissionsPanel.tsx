import React, { useContext, useEffect, useState } from "react";
import {
  Assignment,
  AssignmentProblemSubmissions,
  AssignmentSubmission,
  Submission,
} from "../../../../../../gql-types";
import { AssignmentSubmissionMap } from "../../../../../../utils";
import { AssignmentContext } from "../Assignment";
import gql from "graphql-tag";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Link,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CustomTable from "../../../../../../components/CustomTable/CustomTable";
import SubmissionModal from "../../../../../../components/SubmissionModal/SubmissionModal";

const GET_CURRENT_ASSIGNMENT_SUBMISSION = gql`
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

const GET_PROBLEM_SUBMISSIONS_FOR_ASSIGNMENT = gql`
  query getProblemSubmissionsForAssignment($assignmentId: ID!) {
    getProblemSubmissionsForAssignment(assignmentId: $assignmentId) {
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

const SET_ASSIGNMENT_PROBLEM_SUBMISSION = gql`
  mutation setAssignmentProblemSubmission(
    $assignmentId: ID!
    $submissionId: ID!
  ) {
    setAssignmentProblemSubmission(
      assignmentId: $assignmentId
      submissionId: $submissionId
    )
  }
`;

const REMOVE_ASSIGNMENT_PROBLEM_SUBMISSION = gql`
  mutation removeAssignmentProblemSubmission(
    $assignmentId: ID!
    $problemId: ID!
  ) {
    removeAssignmentProblemSubmission(
      assignmentId: $assignmentId
      problemId: $problemId
    )
  }
`;

const LearnerAssignmentSubmissionsPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  const [assignmentSubmissions, setAssignmentSubmissions] =
    useState<AssignmentSubmissionMap>({});

  const [problemSubmissions, setProblemSubmissions] = useState<
    AssignmentProblemSubmissions[]
  >([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalSubmissionId, setModalSubmissionId] = useState<number>(-1);

  const [
    getAssignmentSubmissions,
    {
      loading: currentSubmissionLoading,
      error: currentSubmissionError,
      data: currentSubmissionData,
    },
  ] = useLazyQuery(GET_CURRENT_ASSIGNMENT_SUBMISSION, {
    onCompleted: ({ getAssignmentSubmissions }) => {
      const x: AssignmentSubmissionMap = getAssignmentSubmissions.reduce(
        (a: any, v: AssignmentSubmission) => ({ ...a, [v.problem.id]: v }),
        {}
      );
      setAssignmentSubmissions(x);
    },
    variables: {
      assignmentId: assignment.id,
    },
  });

  const [getProblemSubmissions, { loading, error, data }] = useLazyQuery(
    GET_PROBLEM_SUBMISSIONS_FOR_ASSIGNMENT,
    {
      onCompleted: ({ getProblemSubmissionsForAssignment }) => {
        setProblemSubmissions(getProblemSubmissionsForAssignment);
      },
      variables: {
        assignmentId: assignment.id,
      },
    }
  );

  const [setAssignmentProblemSubmission] = useMutation(
    SET_ASSIGNMENT_PROBLEM_SUBMISSION,
    {
      onCompleted: () => {
        getAssignmentSubmissions();
      },
      onError(err) {
        const message =
          (err.graphQLErrors &&
            err.graphQLErrors[0] &&
            err.graphQLErrors[0].message) ||
          err.message;
        window.alert(
          `Failed to assign submission for this problem. \n\n${message}`
        );
      },
    }
  );

  const [removeAssignmentProblemSubmission] = useMutation(
    REMOVE_ASSIGNMENT_PROBLEM_SUBMISSION,
    {
      onCompleted: () => {
        getAssignmentSubmissions();
      },
      onError(err) {
        const message =
          (err.graphQLErrors &&
            err.graphQLErrors[0] &&
            err.graphQLErrors[0].message) ||
          err.message;
        window.alert(
          `Failed to remove submission for this problem. \n\n${message}`
        );
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
      <SubmissionModal
        {...{ isOpen, onClose, submissionId: modalSubmissionId }}
      />
      {/* students see list of the submissions to the problem since the creation of
      the assignment and they can assign any of their submissions to be the
      submission for each problem in the assignment. they can change this any
      time.
      <br /> */}
      <Box>
        <Heading>Current submission for this assignment</Heading>
        <br />
        <CustomTable
          data={Object.entries(assignmentSubmissions).map(
            ([problemId, assignmentSubmission]) => {
              const problem = assignmentSubmission.problem;
              const submission = assignmentSubmission.submission;

              return {
                id: problem.id,
                problemName: problem.specification.title,
                submission: submission ? "" + submission.id : "N/A",
                passed: submission ? "" + submission.passed : "N/A",
                options: (
                  <ButtonGroup>
                    {submission === null ? (
                      <Button isDisabled={true} colorScheme={"blue"}>
                        You must set a submission for this problem
                      </Button>
                    ) : (
                      <Button
                        colorScheme={"blue"}
                        onClick={() => {
                          removeAssignmentProblemSubmission({
                            variables: {
                              assignmentId: assignment.id,
                              problemId: problem.id,
                            },
                          });
                        }}
                      >
                        Remove as submission for this problem
                      </Button>
                    )}
                  </ButtonGroup>
                ),
              };
            }
          )}
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
      {problemSubmissions.map((x: AssignmentProblemSubmissions) => {
        const problem = x.problem;
        const submissions = x.submissions;

        return (
          <Box key={problem.id} mt={16}>
            <Heading>
              Problem: #{problem.id} {problem.specification.title}
            </Heading>
            <Button
              mt={4}
              as={Link}
              href={`/problems/${problem.id}`}
              target={"_blank"}
              colorScheme={"blue"}
            >
              Go to problem
            </Button>

            <br />
            <br />

            <Box>
              {submissions && submissions.length > 0 ? (
                <CustomTable
                  data={submissions.map((submission: Submission) => {
                    return {
                      id: submission.id,
                      passed: "" + submission.passed,
                      options: (
                        <ButtonGroup>
                          <Button
                            colorScheme={"blue"}
                            onClick={() => {
                              setModalSubmissionId(parseInt(submission.id));
                              onOpen();
                            }}
                          >
                            View Submission
                          </Button>
                          {assignmentSubmissions[problem.id] &&
                          assignmentSubmissions[problem.id].submission &&
                          assignmentSubmissions[problem.id].submission!.id ===
                            submission.id ? (
                            <Button isDisabled={true} colorScheme={"blue"}>
                              Submission is used for this problem
                            </Button>
                          ) : (
                            <Button
                              colorScheme={"blue"}
                              onClick={() => {
                                setAssignmentProblemSubmission({
                                  variables: {
                                    assignmentId: assignment.id,
                                    submissionId: submission.id,
                                  },
                                });
                              }}
                            >
                              Set as submission for this problem
                            </Button>
                          )}
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
                <Text textAlign={"center"} py={8}>
                  You have not made any submissions for this problem
                </Text>
              )}
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default LearnerAssignmentSubmissionsPanel;
