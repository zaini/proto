import React from "react";
import { Submission } from "../../gql-types";
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
import SubmissionModalStatistics from "./SubmissionModalStatistics/SubmissionModalStatistics";

type Props = {
  submissionId: number;
  isOpen: any;
  onClose: any;
};

const GET_SUBMISSION = gql`
  query getSubmission($submissionId: ID!) {
    getSubmission(submissionId: $submissionId) {
      id
      passed
      avgTime
      avgMemory
      language
      createdAt
      submissionResults {
        passed
      }
      code
    }
  }
`;

const SubmissionModal = ({ submissionId, isOpen, onClose }: Props) => {
  const { loading, error, data } = useQuery(GET_SUBMISSION, {
    variables: {
      submissionId,
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
          <ModalHeader>Submission #{submissionId}</ModalHeader>
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

  const submission: Submission = data.getSubmission;

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
        <ModalHeader>Submission #{submissionId}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SubmissionModalStatistics submission={submission} />
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

export default SubmissionModal;
