import React, { createContext, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { Classroom as ClassroomType } from "../../../../gql-types";
import CopyLink from "../../../../components/CopyLink/CopyLink";
import ClassroomStudentsPanel from "./ClassroomStudentsPanel/ClassroomStudentsPanel";
import ClassroomAssignmentsPanel from "./ClassroomAssignmentsPanel/ClassroomAssignmentsPanel";
import DeleteClassroom from "../DeleteClassroom/DeleteClassroom";
import CreateAssignment from "./CreateAssignment/CreateAssignment";

const ClassroomContext = createContext<ClassroomType | any>({ classroom: {} });

const GET_CLASSROOM = gql`
  query getClassroom($classroomId: ID!) {
    getClassroom(classroomId: $classroomId) {
      id
      name
      password
      creator {
        username
      }
      createdAt
      users {
        id
        username
      }
      assignments {
        id
        name
        setDate
        dueDate
        submissions {
          id
        }
        problems {
          id
          specification {
            title
          }
        }
      }
    }
  }
`;

const DELETE_CLASSROOM = gql`
  mutation DeleteClassroom(
    $classroomId: ID!
    $classroomName: String!
    $password: String
  ) {
    deleteClassroom(
      classroomId: $classroomId
      classroomName: $classroomName
      password: $password
    )
  }
`;

const CREATE_ASSIGNMENT = gql`
  mutation createAssignment(
    $classroomId: ID!
    $assignmentName: String!
    $dueDate: String!
    $problemIds: [ID!]
  ) {
    createAssignment(
      classroomId: $classroomId
      assignmentName: $assignmentName
      dueDate: $dueDate
      problemIds: $problemIds
    ) {
      id
      name
      createdAt
      dueDate
      problems {
        id
        specification {
          title
        }
      }
    }
  }
`;

const Classroom = () => {
  const { classroomId } = useParams();

  const {
    isOpen: isOpenDeleteClassroom,
    onOpen: onOpenDeleteClassroom,
    onClose: onCloseDeleteClassroom,
  } = useDisclosure();

  const {
    isOpen: isOpenSetAssignment,
    onOpen: onOpenSetAssignment,
    onClose: onCloseSetAssignment,
  } = useDisclosure();

  const [tabIndex, setTabIndex] = useState(0);

  const { loading, error, data } = useQuery(GET_CLASSROOM, {
    variables: {
      classroomId: classroomId,
    },
  });

  const [deleteClassroom] = useMutation(DELETE_CLASSROOM, {
    onCompleted: ({ deleteClassroom }) => {
      window.location.href = `/dashboard/classrooms/`;
    },
    onError(err) {
      const message =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        err.message;
      window.alert(`Failed to delete classroom. \n\n${message}`);
    },
  });

  const [createAssignment] = useMutation(CREATE_ASSIGNMENT, {
    onCompleted: ({ createAssignment }) => {
      console.log(createAssignment);
      window.location.href = `/dashboard/classrooms/${classroomId}/assignments/${createAssignment.id}`;
    },
    onError(err) {
      const message =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        err.message;
      window.alert(`Failed to create assignment. \n\n${message}`);
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

  const classroomData: ClassroomType = data.getClassroom;

  return (
    <ClassroomContext.Provider value={{ classroom: classroomData }}>
      <DeleteClassroom
        isOpen={isOpenDeleteClassroom}
        onClose={onCloseDeleteClassroom}
        deleteClassroom={deleteClassroom}
      />

      <CreateAssignment
        isOpen={isOpenSetAssignment}
        onClose={onCloseSetAssignment}
        classroom={classroomData}
        createAssignment={createAssignment}
      />

      <Box mx={4}>
        <Link to={`/dashboard/classrooms`}>
          <Button my={4}>&lt;- All Classrooms</Button>
        </Link>

        <Heading>
          #{classroomId} {classroomData.name}
        </Heading>
        <Heading size={"sm"}>Created: {new Date().toLocaleString()}</Heading>
        <Heading fontSize={"0.9em"}>
          {classroomData.password === ""
            ? "public"
            : "private (password required to join)"}
        </Heading>
        <Heading size={"sm"}>
          Owner: {`${classroomData.creator!.username}`}
        </Heading>

        <Center>
          <ButtonGroup>
            <Button onClick={onOpenSetAssignment}>Set Assignment</Button>
            <CopyLink
              link={
                window.location.origin +
                `/dashboard/classrooms/join/${classroomId}`
              }
              text={"Copy Invite Link"}
            />
            <Button colorScheme={"red"} onClick={onOpenDeleteClassroom}>
              Delete Classroom
            </Button>
          </ButtonGroup>
        </Center>

        <Tabs
          index={tabIndex}
          onChange={(index) => {
            setTabIndex(index);
          }}
        >
          <TabList>
            <Tab>Students</Tab>
            <Tab>Assignments</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ClassroomStudentsPanel />
            </TabPanel>
            <TabPanel>
              <ClassroomAssignmentsPanel onOpen={onOpenSetAssignment} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ClassroomContext.Provider>
  );
};

export { Classroom, ClassroomContext };
