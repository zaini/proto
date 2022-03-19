import React, { useEffect, useState } from "react";
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
  Box,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";
import { Select } from "chakra-react-select";
import { Problem } from "../../../../../gql-types";

const GET_PROBLEMS = gql`
  query getProblems {
    getProblems {
      id
      specification {
        title
      }
    }
  }
`;

const CreateAssignment = ({
  isOpen,
  onClose,
  classroom,
  createAssignment,
}: any) => {
  const { loading, error, data } = useQuery(GET_PROBLEMS);

  const [assignmentName, setAssignmentName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [selectedProblems, setSelectedProblems] = useState<
    { label: string; value: string }[]
  >([]);

  const addProblem = (problem: { label: string; value: string }) => {
    if (problem) {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const removeProblem = (problem: { label: string; value: string }) => {
    if (problem) {
      let problemsCopy = selectedProblems.filter(
        (e) => e.value !== problem.value
      );
      setSelectedProblems(problemsCopy);
    }
  };

  if (error) {
    window.alert("Failed to get problems.\n" + error);
  }

  const problemOptions: { label: string; value: string }[] =
    data && data.getProblems
      ? data.getProblems.map((problem: Problem) => ({
          label: `#${problem.id} ${problem.specification.title}`,
          value: problem.id,
        }))
      : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
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
            <InputGroup>
              <InputLeftAddon children="Problems" />
              {loading ? (
                <Spinner />
              ) : (
                <Box width={"100%"}>
                  <Select
                    colorScheme="blue"
                    isMulti
                    value={selectedProblems}
                    onChange={(e: any) => {
                      if (e.length > selectedProblems.length) {
                        let addedProblem = e.filter(
                          (x: any) => !selectedProblems.includes(x)
                        )[0];
                        addProblem(addedProblem);
                      } else {
                        let removedProblem = selectedProblems.filter(
                          (x: any) => !e.includes(x)
                        )[0];
                        removeProblem(removedProblem);
                      }
                    }}
                    options={problemOptions}
                  />
                </Box>
              )}
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
                  problemIds: selectedProblems.map((x) => x.value),
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
