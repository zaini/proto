import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  useDisclosure,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Assignment as AssignmentType } from "../../../../../gql-types";
import DeleteAssignment from "./DeleteAssignment/DeleteAssignment";
import AssignmentGeneralPanel from "./AssignmentGeneralPanel/AssignmentGeneralPanel";
import AssignmentSubmissionsPanel from "./AssignmentSubmissionsPanel/AssignmentSubmissionsPanel";
import { AssignmentContext } from "./Assignment";

const TeacherAssignment = () => {
  const { classroomId } = useParams();
  const { assignment }: { assignment: AssignmentType } =
    useContext(AssignmentContext);

  const {
    isOpen: isOpenDeleteAssignment,
    onOpen: onOpenDeleteAssignment,
    onClose: onCloseDeleteAssignment,
  } = useDisclosure();

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box px={"12.5%"} pt={8}>
      <DeleteAssignment
        isOpen={isOpenDeleteAssignment}
        onClose={onCloseDeleteAssignment}
        assignment={assignment}
        classroom={assignment.classroom}
      />
      <Box>
        <Link to={`/dashboard/classrooms/${classroomId}/assignments`}>
          <Button my={4} colorScheme={"blue"}>
            &lt;- All Assignments
          </Button>
        </Link>

        <Heading>
          Classroom: {assignment.classroom.name} | Assignment: {assignment.name}
        </Heading>
        <br />
        <Heading size={"sm"}>
          Set: {new Date(parseInt(assignment.setDate)).toLocaleString()}
        </Heading>
        <Heading size={"sm"}>
          Due: {new Date(parseInt(assignment.dueDate)).toLocaleString()}
        </Heading>
        <br />

        <Center>
          <ButtonGroup>
            <Button colorScheme={"red"} onClick={onOpenDeleteAssignment}>
              Delete Assignment
            </Button>
          </ButtonGroup>
        </Center>

        <br />

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
            <TabPanel pb={0}>
              <AssignmentGeneralPanel />
            </TabPanel>
            <TabPanel pb={0}>
              <AssignmentSubmissionsPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default TeacherAssignment;
