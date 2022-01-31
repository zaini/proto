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
  Stack,
  Code,
  Input,
  InputRightElement,
  IconButton,
  Box,
  List,
  ListItem,
  UnorderedList,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const CreateAssignment = ({
  isOpen,
  onClose,
  classroom,
  createAssignment,
}: any) => {
  const [assignmentName, setAssignmentName] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [problemId, setProblemId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const addProblem = (problemId: string) => {
    if (problemId) {
      setProblems([...problems, problemId]);
      setProblemId("");
    }
  };

  const removeProblem = (problemId: string) => {
    if (problemId) {
      let problemsCopy = problems.filter((e) => e !== problemId);
      setProblems(problemsCopy);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Assignment</ModalHeader>
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
            {/* TODO: improve how to add problems with a proper search */}
            <InputGroup>
              <InputLeftAddon children="Problems" />
              <Input
                type="text"
                placeholder="Two Sum"
                value={problemId}
                onChange={(e) => setProblemId(e.target.value)}
              />
              <InputRightElement
                children={
                  <IconButton
                    aria-label="Add problem"
                    icon={<AddIcon />}
                    onClick={() => addProblem(problemId)}
                  />
                }
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon children="Due Date" />
              <Input
                type="datetime-local"
                onChange={(e) =>
                  setDueDate(new Date(e.target.value).toUTCString())
                }
              />
            </InputGroup>
            {problems.length > 0 && (
              <Box>
                <Text>Click on a problem to remove it.</Text>
                <UnorderedList>
                  {problems.map((problemId, i) => {
                    return (
                      <ListItem
                        key={i}
                        onClick={() => removeProblem(problemId)}
                      >
                        {problemId}
                      </ListItem>
                    );
                  })}
                </UnorderedList>
              </Box>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              createAssignment({
                variables: {
                  classroomId: classroom.id,
                  assignmentName: assignmentName,
                  dueDate: dueDate,
                  problemIds: problems,
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
