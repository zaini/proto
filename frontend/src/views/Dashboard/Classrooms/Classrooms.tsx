import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  useDisclosure,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Classroom } from "../../../gql-types";
import CopyLink from "../../../components/CopyLink/CopyLink";
import CreateClassroom from "./CreateClassroom/CreateClassroom";

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

      <CreateClassroom
        isOpen={isOpen}
        onClose={onClose}
        createClassroom={createClassroom}
      />

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
                classroomName: `#${classroom.id} ${classroom.name}`,
                numberOfStudents: classroom.users
                  ? 0
                  : classroom!.users!.length,
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
                    <CopyLink
                      link={
                        window.location.origin +
                        `/dashboard/classrooms/join/${classroom.id}`
                      }
                      text={"Copy Invite Link"}
                      colorScheme="blue"
                    />
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
