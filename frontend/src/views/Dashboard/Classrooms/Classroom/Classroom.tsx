import React, { createContext, useContext, useState } from "react";
import { Box, Button, ButtonGroup, Center, Heading } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { AuthContext } from "../../../../context/Auth";

const ClassroomContext = createContext<any>({
  classroomId: null,
});

const Classroom = () => {
  const { user }: any = useContext(AuthContext);
  const { classroomId } = useParams();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <ClassroomContext.Provider value={{ classroomId }}>
      <Box mx={4}>
        <Link to={`/dashboard/classrooms`}>
          <Button my={4}>&lt;- All Classrooms</Button>
        </Link>

        <Heading>Classroom {classroomId}</Heading>
        <Heading size={"sm"}>Created: {new Date().toLocaleString()}</Heading>
        <Heading size={"sm"}>Owner: {`${user.username}`}</Heading>

        <Center>
          <ButtonGroup>
            <Button>Set Assignment</Button>
            <Button>Copy Invite Link</Button>
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
            <TabPanel>Students</TabPanel>
            <TabPanel>Assignments</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ClassroomContext.Provider>
  );
};

export { Classroom, ClassroomContext };
