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
  InputRightElement,
  Stack,
  Code,
} from "@chakra-ui/react";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Classroom } from "../../../gql-types";

const CREATE_CLASSROOM = gql`
  mutation createClassroom($classroomName: String!, $password: String) {
    createClassroom(classroomName: $classroomName, password: $password) {
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
      password
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
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            <Stack spacing={4}>
              <InputGroup>
                <InputLeftAddon children="Name" />
                <Input
                  type="text"
                  placeholder="FC2 Class A"
                  onChange={(e) => setClassroomName(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon children="Password" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="(optional)"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Code fontWeight={"bold"} p={2}>
                Leave the password blank if you want anyone to be able to join.
                If you include a password, it will be required for people to
                join.
              </Code>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                createClassroom({
                  variables: {
                    classroomName: classroomName,
                    password: password,
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
                Header: "Private/Public",
                accessor: "publicOrPrivate",
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
                publicOrPrivate:
                  classroom.password === "" ? "public" : "private",
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
            <br /> <br />
            <Button onClick={onOpen}>Create Classroom</Button>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default Classrooms;
