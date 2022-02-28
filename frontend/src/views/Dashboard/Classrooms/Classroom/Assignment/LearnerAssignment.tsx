import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Assignment as AssignmentType } from "../../../../../gql-types";
import AssignmentGeneralPanel from "./AssignmentGeneralPanel/AssignmentGeneralPanel";
import AssignmentSubmissionsPanel from "./AssignmentSubmissionsPanel/AssignmentSubmissionsPanel";
import { AssignmentContext } from "./Assignment";

const LearnerAssignment = () => {
  const { classroomId } = useParams();
  const { assignment }: { assignment: AssignmentType } =
    useContext(AssignmentContext);

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Box mx={4}>
        <Link to={`/dashboard/classrooms/${classroomId}/assignments`}>
          <Button my={4}>&lt;- All Assignments</Button>
        </Link>

        <Heading>
          Classroom: {assignment.classroom.name} | Assignment: {assignment.name}
        </Heading>
        <Heading size={"sm"}>
          Set: {new Date(parseInt(assignment.setDate)).toLocaleString()}
        </Heading>
        <Heading size={"sm"}>
          Due: {new Date(parseInt(assignment.dueDate)).toLocaleString()}
        </Heading>

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
              <AssignmentGeneralPanel />
            </TabPanel>
            <TabPanel>
              <AssignmentSubmissionsPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default LearnerAssignment;
