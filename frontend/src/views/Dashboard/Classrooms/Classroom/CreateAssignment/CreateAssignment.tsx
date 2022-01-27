import React, { useState } from "react";
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

const CreateAssignment = ({ isOpen, onClose, createAssignment }: any) => {
  const [assignmentName, setAssignmentName] = useState("");
  const [problems, setProblems] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Assignment (incomplete)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Code fontWeight={"bold"} p={2} textAlign={"center"}>
              Search for the names or IDs of existing problems you would like to
              add to this assignment.
              <br /> <br />
              You also can{" "}
              <b>
                <u>create your own problems</u>
              </b>{" "}
              and then add them to this assignment.
            </Code>
            <InputGroup>
              <InputLeftAddon children="Assignment Name" />
              <Input
                type="text"
                placeholder="Homework 2"
                onChange={(e) => setAssignmentName(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon children="Problems" />
              <Input
                type="text"
                placeholder="Two Sum"
                onChange={(e) => setProblems(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon children="Due Date" />
              <Input type="datetime-local" />
            </InputGroup>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              createAssignment({
                variables: {
                  assignmentName: assignmentName,
                },
              });
            }}
          >
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAssignment;
