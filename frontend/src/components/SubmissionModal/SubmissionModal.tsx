import React from "react";
import { Submission } from "../../gql-types";
import {
  Button,
  Center,
  Link,
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
        <ModalHeader>
          Submission #{submission.id} for #{submission.problem.id}{" "}
          {submission.problem.specification.title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button
            as={Link}
            href={`/problems/${submission.problem.id}`}
            target={"_blank"}
            colorScheme={"blue"}
          >
            Go to problem
          </Button>
          <br />
          <br />
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
