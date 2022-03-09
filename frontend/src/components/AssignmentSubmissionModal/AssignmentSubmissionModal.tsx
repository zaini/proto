import React, { useContext } from "react";
import {
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
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { AssignmentSubmissionQueryData } from "../../utils";
import { Assignment, UserAssignmentSubmission } from "../../gql-types";
import { AssignmentContext } from "../../views/Dashboard/Classrooms/Classroom/Assignment/Assignment";

type Props = {
  assignmentSubmissionQueryData: AssignmentSubmissionQueryData;
  isOpen: any;
  onClose: any;
};

const GET_ASSIGNMENT_SUBMISSION = gql`
  query getAssignmentSubmissionForUser($assignmentId: ID!, $userId: ID!) {
    getAssignmentSubmissionForUser(
      assignmentId: $assignmentId
      userId: $userId
    ) {
      user {
        id
        username
      }
      assignmentSubmission {
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
  }
`;

const AssignmentSubmissionModal = ({
  assignmentSubmissionQueryData,
  isOpen,
  onClose,
}: Props) => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  const { loading, error, data } = useQuery(GET_ASSIGNMENT_SUBMISSION, {
    variables: {
      assignmentId: assignmentSubmissionQueryData.assignmentId,
      userId: assignmentSubmissionQueryData.userId,
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
            Assignment Submission #{assignmentSubmissionQueryData.assignmentId}
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

  const userAssignmentSubmission: UserAssignmentSubmission =
    data.getAssignmentSubmissionForUser;

  const user = userAssignmentSubmission.user;
  const assignmentSubmission = userAssignmentSubmission.assignmentSubmission;

  const numOfProblems = assignment.problems?.length;

  const attempts = assignmentSubmission?.length;

  const solves = assignmentSubmission?.filter(
    (assignmentSubmission) => assignmentSubmission?.submission?.passed
  ).length;

  const lastChange = Math.max.apply(
    Math,
    assignmentSubmission!.map((o) => {
      return o?.submission?.createdAt
        ? parseInt(o?.submission?.createdAt)
        : -Infinity;
    })
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
          Assignment Submission #{assignmentSubmissionQueryData.assignmentId}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* {JSON.stringify(assignmentSubmission)} */}

          {JSON.stringify({
            learner: user.username,
            attempted: `${attempts}/${numOfProblems}`,
            solved: `${solves}/${numOfProblems}`,
            lastChange:
              lastChange === -Infinity
                ? "N/A"
                : new Date(lastChange).toLocaleString(),
          })}
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
