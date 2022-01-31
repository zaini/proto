import React, { useContext, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Stack,
  Code,
  Input,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { ClassroomContext } from "../../Classroom";
import { Classroom } from "../../../../../../gql-types";

const DELETE_ASSIGNMENT = gql`
  mutation removeAssignment($assignmentId: ID!, $assignmentName: String!) {
    removeAssignment(
      assignmentId: $assignmentId
      assignmentName: $assignmentName
    )
  }
`;

const DeleteAssignment = ({ isOpen, onClose, assignment, classroom }: any) => {
  const [assignmentName, setAssignmentName] = useState("");

  const [removeAssignment] = useMutation(DELETE_ASSIGNMENT, {
    onCompleted: ({ removeAssignment }) => {
      window.location.href = `/dashboard/classrooms/${classroom.id}`;
    },
    onError(err) {
      const message =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        err.message;
      window.alert(`Failed to delete assignment. \n\n${message}`);
    },
  });

  if (!assignment) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Assignment is not loaded</ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Assignment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <InputGroup>
              <InputLeftAddon children="Assignment Name" />
              <Input
                type="text"
                placeholder={assignment.name}
                onChange={(e) => setAssignmentName(e.target.value)}
              />
            </InputGroup>
            <Code fontWeight={"bold"} p={2}>
              WARNING: Deleting a assignment is NOT reversible. You will NOT be
              asked to confirm deletion.
            </Code>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              removeAssignment({
                variables: {
                  assignmentId: assignment.id,
                  assignmentName: assignmentName,
                },
              });
            }}
          >
            Delete
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAssignment;
