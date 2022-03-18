import React from "react";
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
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import {
  AssignmentSubmissionMap,
  AssignmentSubmissionQueryData,
} from "../../utils";
import { AssignmentSubmission } from "../../gql-types";
import SubmissionModalStatistics from "../SubmissionModal/SubmissionModalStatistics/SubmissionModalStatistics";

type Props = {
  assignmentSubmissionQueryData: AssignmentSubmissionQueryData;
  isOpen: any;
  onClose: any;
};

const GET_ASSIGNMENT_SUBMISSIONS = gql`
  query getAssignmentSubmissions($assignmentId: ID!, $userId: ID) {
    getAssignmentSubmissions(assignmentId: $assignmentId, userId: $userId) {
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
  assignmentSubmissionQueryData,
  isOpen,
  onClose,
}: Props) => {
  const { loading, error, data } = useQuery(GET_ASSIGNMENT_SUBMISSIONS, {
    variables: {
      assignmentId: assignmentSubmissionQueryData.assignment.id,
      userId: assignmentSubmissionQueryData.user.id,
    },
  });

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
            Assignment Submission #{assignmentSubmissionQueryData.assignment.id}
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
          {assignmentSubmissionQueryData.user.username}'s assignment submission
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* TODO add statistics here such as if they overall passed the assignmetn */}
          <Box>
            <Button
              as={Link}
              href={`/dashboard/classrooms/${assignmentSubmissionQueryData.assignment.classroom.id}/assignments/${assignmentSubmissionQueryData.assignment.id}`}
              target={"_blank"}
              colorScheme={"blue"}
            >
              Go to Assignment
            </Button>
            <br />
            <br />
            <Tabs>
              <TabList>
                {Object.entries(assignmentSubmissions).map(
                  ([problemId, assignmentSubmission]) => {
                    const problem = assignmentSubmission.problem;
                    return <Tab>{problem.specification.title}</Tab>;
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
                            <SubmissionModalStatistics
                              submission={submission}
                            />
                          </>
                        ) : (
                          "no submission"
                        )}
                      </TabPanel>
                    );
                  }
                )}
              </TabPanels>
            </Tabs>
          </Box>
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
