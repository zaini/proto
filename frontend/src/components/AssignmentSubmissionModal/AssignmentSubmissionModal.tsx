import React from "react";
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
import { AssignmentSubmission } from "../../gql-types";

type Props = {
  assignmentSubmissionQueryData: AssignmentSubmissionQueryData;
  isOpen: any;
  onClose: any;
};

const GET_ASSIGNMENT_SUBMISSIONS = gql`
  query getAssignmentSubmissions($assignmentId: ID!, $userId: ID) {
    getAssignmentSubmissions(assignmentId: $assignmentId, userId: $userId) {
      submission {
        id
        code
        language
        avgTime
        avgMemory
        passed
        createdAt
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

  const assignmentSubmission: AssignmentSubmission =
    data.getAssignmentSubmission;

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
          {/* TODO this */}
          summary of ths assignment submission for this user goes here
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
