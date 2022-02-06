import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Classroom } from "../../../../gql-types";
import CopyLink from "../../../../components/CopyLink/CopyLink";
import ClassroomStudentsPanel from "./ClassroomStudentsPanel/ClassroomStudentsPanel";
import ClassroomAssignmentsPanel from "./ClassroomAssignmentsPanel/ClassroomAssignmentsPanel";
import DeleteClassroom from "../DeleteClassroom/DeleteClassroom";
import CreateAssignment from "./CreateAssignment/CreateAssignment";
import { ClassroomContext } from "./Classroom";

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

const TeacherClassroom = () => {
  const { classroom }: { classroom: Classroom } = useContext(ClassroomContext);

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
      window.location.href = `/dashboard/classrooms/${classroom.id}/assignments/${createAssignment.id}`;
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

  return (
    <>
      <DeleteClassroom
        isOpen={isOpenDeleteClassroom}
        onClose={onCloseDeleteClassroom}
        deleteClassroom={deleteClassroom}
      />

      <CreateAssignment
        isOpen={isOpenSetAssignment}
        onClose={onCloseSetAssignment}
        classroom={classroom}
        createAssignment={createAssignment}
      />

      <Box mx={4}>
        <Link to={`/dashboard/classrooms`}>
          <Button my={4}>&lt;- All Classrooms</Button>
        </Link>

        <Heading>
          #{classroom.id} {classroom.name}
        </Heading>
        <Heading size={"sm"}>
          Created: {new Date(parseInt(classroom.createdAt)).toLocaleString()}
        </Heading>
        <Heading fontSize={"0.9em"}>
          {classroom.password === ""
            ? "public"
            : "private (password required to join)"}
        </Heading>
        <Heading size={"sm"}>Owner: {`${classroom.creator!.username}`}</Heading>

        <Center>
          <ButtonGroup>
            <Button onClick={onOpenSetAssignment}>Set Assignment</Button>
            <CopyLink
              link={
                window.location.origin +
                `/dashboard/classrooms/join/${classroom.id}`
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
    </>
  );
};

export default TeacherClassroom;
