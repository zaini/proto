import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  InputLeftAddon,
  Input,
} from "@chakra-ui/react";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

const CREATE_CLASSROOM = gql`
  mutation createClassroom($classroomName: String!) {
    createClassroom(classroomName: $classroomName) {
      id
      name
    }
  }
`;

const Classrooms = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [classroomName, setClassroomName] = useState("");
  const [createClassroom, { loading, error, data }] = useMutation(
    CREATE_CLASSROOM,
    {
      onCompleted: ({ createClassroom }) => {
        console.log("created new classroom", createClassroom);
        // redirect to the page for this classroom
      },
      onError(err) {
        window.alert(
          "Failed to create classroom. \n\nYou must not own another classroom with the same name."
        );
      },
    }
  );

  return (
    <Box mx={4}>
      <Heading>Classrooms</Heading>
      <Button onClick={onOpen}>Create Classroom</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Classroom</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
              <InputLeftAddon children="Classroom Name" />
              <Input
                type="text"
                placeholder="FC2 Class A"
                onChange={(e) => setClassroomName(e.target.value)}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                createClassroom({
                  variables: {
                    classroomName: classroomName,
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

      <Box mt={4}>
        <CustomTable
          columns={[
            {
              Header: "Classroom Name",
              accessor: "classroomName",
            },
            {
              Header: "# of Students",
              accessor: "numberOfStudents",
            },
            {
              Header: "Created",
              accessor: "createdAt",
            },
            {
              Header: "Options",
              accessor: "options",
            },
          ]}
          data={[
            {
              classroomName: "FC2",
              numberOfStudents: 30,
              createdAt: new Date().toLocaleString(),
              options: (
                <ButtonGroup>
                  <Link to={`/dashboard/classrooms/${1}`}>
                    <Button colorScheme={"blue"}>View</Button>
                  </Link>
                  <Button colorScheme={"blue"}>Set Assignment</Button>
                  <Button colorScheme={"blue"}>Copy Invite Link</Button>
                </ButtonGroup>
              ),
            },
            {
              classroomName: "PPA",
              numberOfStudents: 24,
              createdAt: new Date().toLocaleString(),
              options: (
                <ButtonGroup>
                  <Link to={`/dashboard/classrooms/${2}`}>
                    <Button colorScheme={"blue"}>View</Button>
                  </Link>
                  <Button colorScheme={"blue"}>Set Assignment</Button>
                  <Button colorScheme={"blue"}>Copy Invite Link</Button>
                </ButtonGroup>
              ),
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default Classrooms;
