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
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

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
          {JSON.stringify({
            time: new Date(parseInt(submission.createdAt)).toLocaleString(),
            passed: `${submission.passed}`,
            avgTime: submission.avgTime.toFixed(2) + " ms",
            avgMemory: submission.avgMemory.toFixed(2) + " MB",
            language: submission.language,
          })}
          <CodeMirror
            value={submission.code}
            editable={false}
            height="600px"
            theme={"dark"}
            extensions={[python()]}
          />
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
