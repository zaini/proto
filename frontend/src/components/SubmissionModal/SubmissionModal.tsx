import React from "react";
import { Submission } from "../../gql-types";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

type Props = {
  submission: Submission | null;
  isOpen: any;
  onClose: any;
};

const SubmissionModal = ({ submission, isOpen, onClose }: Props) => {
  if (!submission) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invalid Submission</ModalHeader>
          <ModalCloseButton />
          <ModalBody>There is no submission to show.</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
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
        <ModalHeader>Submission #{submission.id}</ModalHeader>
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
            value={`code goes here
            code goes here
            code goes here
            code goes here`}
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
