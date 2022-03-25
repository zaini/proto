import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Link,
  Text,
  InputGroup,
  InputLeftAddon,
  Input,
} from "@chakra-ui/react";
import { useMutation, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import {
  AssignmentSubmissionMap,
  AssignmentSubmissionModalData,
} from "../../utils";
import { AssignmentSubmission } from "../../gql-types";
import SubmissionModalStatistics from "../SubmissionModal/SubmissionModalStatistics/SubmissionModalStatistics";

type Props = {
  assignmentSubmissionModalData: AssignmentSubmissionModalData;
  isOpen: any;
  onClose: any;
};

const SET_ASSIGNMENT_SUBMISSION_MARK = gql`
  mutation setAssignmentSubmissionFeedback(
    $userId: ID!
    $problemId: ID!
    $mark: Float!
    $comments: String!
    $assignmentId: ID!
  ) {
    setAssignmentSubmissionFeedback(
      userId: $userId
      problemId: $problemId
      mark: $mark
      comments: $comments
      assignmentId: $assignmentId
    ) {
      mark
      comments
    }
  }
`;

const GET_ASSIGNMENT_SUBMISSIONS = gql`
  query getAssignmentSubmissions($assignmentId: ID!, $userId: ID) {
    getAssignmentSubmissions(assignmentId: $assignmentId, userId: $userId) {
      mark
      comments
      assignment {
        id
        name
      }
      user {
        username
      }
      submission {
        id
        userId
        createdAt
        passed
        avgMemory
        avgTime
        language
        code
        testCaseSubmissions {
          id
          passed
          stdout
          stderr
          compile_output
          time
          description
          memory
          testCase {
            stdin
            expectedOutput
            isHidden
          }
        }
        problem {
          id
          specification {
            title
          }
        }
      }
      problem {
        id
        specification {
          title
        }
      }
    }
  }
`;

const AssignmentSubmissionModal = ({
  assignmentSubmissionModalData,
  isOpen,
  onClose,
}: Props) => {
  const [mark, setMark] = useState<number | null>();
  const [comments, setComments] = useState<string>("");

  const [getAssignmentSubmissions, { loading, error, data }] = useLazyQuery(
    GET_ASSIGNMENT_SUBMISSIONS,
    {
      variables: {
        assignmentId: assignmentSubmissionModalData.assignment.id,
        userId: assignmentSubmissionModalData.user.id,
      },
    }
  );

  const [setAssignmentSubmissionFeedback] = useMutation(
    SET_ASSIGNMENT_SUBMISSION_MARK,
    {
      refetchQueries: [
        GET_ASSIGNMENT_SUBMISSIONS,
        "getAssignmentSubmissions",
        "getAssignmentExportData",
      ],
      onError(err) {
        const message =
          (err.graphQLErrors &&
            err.graphQLErrors[0] &&
            err.graphQLErrors[0].message) ||
          err.message;
        window.alert(`Failed to mark assignment. \n\n${message}`);
      },
    }
  );

  useEffect(() => {
    if (assignmentSubmissionModalData.assignment.id) {
      getAssignmentSubmissions();
    }
  }, [assignmentSubmissionModalData]);

  if (!data)
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
        scrollBehavior={"inside"}
        // size={"full"}
        size={"1"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Assignment Submission #{assignmentSubmissionModalData.assignment.id}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Center h="1000px">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Center>
            ) : (
              error && <>Error! ${error.message}</>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

  const aS: AssignmentSubmission[] = data.getAssignmentSubmissions;

  const assignmentSubmissions: AssignmentSubmissionMap = aS.reduce(
    (a: any, v: AssignmentSubmission) => ({ ...a, [v.problem.id]: v }),
    {}
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
      scrollBehavior={"inside"}
      // size={"full"}
      size={"1"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {assignmentSubmissionModalData.user.username}'s assignment submission
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button
            as={Link}
            href={`/dashboard/classrooms/${assignmentSubmissionModalData.assignment.classroom.id}/assignments/${assignmentSubmissionModalData.assignment.id}`}
            target={"_blank"}
            colorScheme={"blue"}
          >
            Go to Assignment
          </Button>
          <br />
          <br />
          <Text>
            <b>Attempted:</b>{" "}
            {assignmentSubmissionModalData.assignmentSubmissionStats.attempted}{" "}
            problems
            <br />
            <b>Solved:</b>{" "}
            {assignmentSubmissionModalData.assignmentSubmissionStats.solved}{" "}
            problems
            <br />
            <b>Last Change:</b>{" "}
            {assignmentSubmissionModalData.assignmentSubmissionStats.lastChange}
          </Text>
          <br />
          <Tabs>
            <TabList>
              {Object.entries(assignmentSubmissions).map(
                ([problemId, assignmentSubmission]) => {
                  const problem = assignmentSubmission.problem;
                  const submission = assignmentSubmission.submission;

                  return (
                    <Tab>
                      {problem.specification.title}{" "}
                      {submission ? (submission.passed ? "✔" : "❌") : "❔"}
                    </Tab>
                  );
                }
              )}
            </TabList>
            <TabPanels>
              {Object.entries(assignmentSubmissions).map(
                ([problemId, assignmentSubmission]) => {
                  const problem = assignmentSubmission.problem;
                  const submission = assignmentSubmission.submission;

                  return (
                    <TabPanel>
                      <Button
                        as={Link}
                        href={`/problems/${problem.id}`}
                        target={"_blank"}
                        colorScheme={"blue"}
                      >
                        Go to problem
                      </Button>
                      <br />
                      <br />
                      {submission ? (
                        <>
                          <Box>
                            <Text>
                              <b>Current Mark:</b>{" "}
                              {assignmentSubmission.mark
                                ? `${assignmentSubmission.mark}/100`
                                : "Unmarked"}
                            </Text>
                            <Text>
                              <b>Current Comments:</b>{" "}
                              {assignmentSubmission.comments || "N/A"}
                            </Text>
                          </Box>
                          <br />
                          <InputGroup>
                            <InputLeftAddon children="New Mark" />
                            <Input
                              type="number"
                              value={`${mark}`}
                              placeholder={String(
                                assignmentSubmission.mark || "Unmarked"
                              )}
                              onChange={(e) =>
                                setMark(parseFloat(e.target.value))
                              }
                            />
                          </InputGroup>
                          <br />
                          <InputGroup>
                            <InputLeftAddon children="Comments" />
                            <Input
                              type="text"
                              value={`${comments}`}
                              placeholder={"Feedback for this submission"}
                              onChange={(e) => setComments(e.target.value)}
                            />
                          </InputGroup>
                          <br />
                          <Button
                            onClick={() =>
                              setAssignmentSubmissionFeedback({
                                variables: {
                                  userId: assignmentSubmissionModalData.user.id,
                                  problemId: problem.id,
                                  mark,
                                  comments,
                                  assignmentId:
                                    assignmentSubmission.assignment.id,
                                },
                              })
                            }
                          >
                            Update Feedback
                          </Button>
                          <br />
                          <br />
                          <SubmissionModalStatistics submission={submission} />
                        </>
                      ) : (
                        "No submission made for this problem."
                      )}
                    </TabPanel>
                  );
                }
              )}
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignmentSubmissionModal;
