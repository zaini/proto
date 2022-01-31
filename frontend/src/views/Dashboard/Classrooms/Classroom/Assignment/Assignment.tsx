import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Spinner,
  useDisclosure,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Assignment as AssignmentType } from "../../../../../gql-types";
import DeleteAssignment from "./DeleteAssignment/DeleteAssignment";
import AssignmentGeneralPanel from "./AssignmentGeneralPanel/AssignmentGeneralPanel";
import AssignmentSubmissionsPanel from "./AssignmentSubmissionsPanel/AssignmentSubmissionsPanel";

const GET_ASSIGNMENT = gql`
  query getAssignment($assignmentId: ID!) {
    getAssignment(assignmentId: $assignmentId) {
      id
      name
      setDate
      dueDate
      classroom {
        id
        name
      }
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
`;

const Assignment = () => {
  const { classroomId, assignmentId } = useParams();

  const {
    isOpen: isOpenDeleteAssignment,
    onOpen: onOpenDeleteAssignment,
    onClose: onCloseDeleteAssignment,
  } = useDisclosure();

  const [tabIndex, setTabIndex] = useState(0);

  const { loading, error, data } = useQuery(GET_ASSIGNMENT, {
    variables: {
      assignmentId: assignmentId,
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

  const assignmentData: AssignmentType = data.getAssignment;

  return (
    <>
      <DeleteAssignment
        isOpen={isOpenDeleteAssignment}
        onClose={onCloseDeleteAssignment}
        assignment={assignmentData}
        classroom={assignmentData.classroom}
      />
      <Box mx={4}>
        <Link to={`/dashboard/classrooms/${classroomId}/assignments`}>
          <Button my={4}>&lt;- All Assignments</Button>
        </Link>

        <Heading>
          Classroom: {assignmentData.classroom.name} | Assignment:{" "}
          {assignmentData.name}
        </Heading>
        <Heading size={"sm"}>
          Set: {new Date(parseInt(assignmentData.setDate)).toLocaleString()}
        </Heading>
        <Heading size={"sm"}>
          Due: {new Date(parseInt(assignmentData.dueDate)).toLocaleString()}
        </Heading>

        <Center>
          <ButtonGroup>
            <Button colorScheme={"red"} onClick={onOpenDeleteAssignment}>
              Delete Assignment
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
            <Tab>General</Tab>
            <Tab>Submissions</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AssignmentGeneralPanel assignment={assignmentData} />
            </TabPanel>
            <TabPanel>
              <AssignmentSubmissionsPanel assignment={assignmentData} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default Assignment;
