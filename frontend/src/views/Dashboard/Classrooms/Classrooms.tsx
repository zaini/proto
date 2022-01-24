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
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Classroom } from "../../../gql-types";

const CREATE_CLASSROOM = gql`
  mutation createClassroom($classroomName: String!) {
    createClassroom(classroomName: $classroomName) {
      id
      name
    }
  }
`;

const GET_CLASSROOMS = gql`
  query getClassrooms {
    getClassrooms {
      id
      name
      createdAt
      users {
        id
      }
    }
  }
`;

const Classrooms = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [classroomName, setClassroomName] = useState("");

  const { loading, error, data } = useQuery(GET_CLASSROOMS);

  const [createClassroom] = useMutation(CREATE_CLASSROOM, {
    onCompleted: ({ createClassroom }) => {
      window.location.href = `/dashboard/classrooms/${createClassroom.id}`;
    },
    onError(err) {
      const message =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        err.message;
      window.alert(`Failed to create classroom. \n\n${message}`);
    },
  });

  if (loading)
    return (
      <Center h="1000px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  // TODO have an actual error page and log this
  if (error) return <>Error! ${error.message}</>;

  const classrooms: Classroom[] = data.getClassrooms;

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
        {classrooms.length > 0 ? (
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
            data={classrooms.map((classroom: Classroom) => {
              return {
                classroomName: classroom.name,
                numberOfStudents: classroom.users.length,
                createdAt: new Date(
                  parseInt(classroom.createdAt)
                ).toLocaleString(),
                options: (
                  <ButtonGroup>
                    <Link to={`/dashboard/classrooms/${classroom.id}`}>
                      <Button colorScheme={"blue"}>View</Button>
                    </Link>
                    <Button colorScheme={"blue"}>Set Assignment</Button>
                    <Button colorScheme={"blue"}>Copy Invite Link</Button>
                  </ButtonGroup>
                ),
              };
            })}
          />
        ) : (
          <Center mb={8}>
            <Text>You do not have any classrooms!</Text>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default Classrooms;
