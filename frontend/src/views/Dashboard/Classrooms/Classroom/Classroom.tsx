import React, { createContext, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Classroom as ClassroomType } from "../../../../gql-types";
import CopyLink from "../../../../components/CopyLink/CopyLink";
import ClassroomStudentsPanel from "./ClassroomStudentsPanel/ClassroomStudentsPanel";
import ClassroomAssignmentsPanel from "./ClassroomAssignmentsPanel/ClassroomAssignmentsPanel";

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
        setDate
        dueDate
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

const Classroom = () => {
  const { classroomId } = useParams();

  const [tabIndex, setTabIndex] = useState(0);

  const { loading, error, data } = useQuery(GET_CLASSROOM, {
    variables: {
      classroomId: classroomId,
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
            <Button>Set Assignment</Button>
            <CopyLink
              link={
                window.location.origin +
                `/dashboard/classrooms/join/${classroomId}`
              }
              text={"Copy Invite Link"}
            />
            <Button colorScheme={"red"}>Delete Classroom</Button>
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
              <ClassroomAssignmentsPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ClassroomContext.Provider>
  );
};

export { Classroom, ClassroomContext };
