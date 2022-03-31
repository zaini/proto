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
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";

export const CREATE_CLASSROOM = gql`
  mutation createClassroom($classroomName: String!, $password: String) {
    createClassroom(classroomName: $classroomName, password: $password) {
      id
      name
    }
  }
`;

export const GET_CLASSROOMS = gql`
  query getTeacherClassrooms {
    getTeacherClassrooms {
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

const TeacherClassrooms = () => {
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

  if (loading) return <Loading />;
  if (error)
    return (
      <Box px={"12.5%"} pt={8}>
        <Error error={error} />
      </Box>
    );

  const classrooms: Classroom[] = data.getTeacherClassrooms;

  return (
    <Box px={"12.5%"} pt={8}>
      <Heading>Classrooms</Heading>
      <br />
      <Button
        data-testid="create-new-classroom"
        onClick={onOpen}
        colorScheme={"blue"}
      >
        Create Classroom
      </Button>

      <br />
      <br />

      <CreateClassroom
        isOpen={isOpen}
        onClose={onClose}
        createClassroom={createClassroom}
      />

      <Box>
        {classrooms && classrooms.length > 0 ? (
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
                numberOfStudents: classroom.users ? classroom.users.length : 0,
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
                    <Link
                      to={`/dashboard/classrooms/${classroom.id}/assignments`}
                    >
                      <Button colorScheme={"blue"}>Set Assignment</Button>
                    </Link>
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
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default TeacherClassrooms;
