import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Code,
  Text,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

const REMOVE_STUDENT = gql`
  mutation removeStudent($studentId: ID!, $classroomId: ID!) {
    removeStudent(studentId: $studentId, classroomId: $classroomId)
  }
`;

const RemoveStudent = ({ isOpen, onClose, student, classroom }: any) => {
  const [removeStudent] = useMutation(REMOVE_STUDENT, {
    onCompleted: ({ removeStudent }) => {
      window.location.href = `/dashboard/classrooms/${classroom.id}`;
    },
    onError(err) {
      const message =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        err.message;
      window.alert(`Failed to remove student from classroom. \n\n${message}`);
    },
  });

  if (!student) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Student is not loaded</ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove Student from Classroom</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack textAlign={"center"} spacing={4}>
            <Text>
              Removing student #{student.id} {student.username}
            </Text>
            <Code fontWeight={"bold"} p={2}>
              WARNING: Removing a student also removes all information about
              them in this classroom. They will have to be invited to rejoin
              this classroom.
            </Code>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              removeStudent({
                variables: {
                  studentId: student.id,
                  classroomId: classroom.id,
                },
              });
            }}
          >
            Remove
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemoveStudent;
