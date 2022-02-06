import React, { useContext } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { Classroom } from "../../../../gql-types";
import CopyLink from "../../../../components/CopyLink/CopyLink";
import { ClassroomContext } from "./Classroom";
import RemoveStudent from "./RemoveStudent/RemoveStudent";
import { AuthContext } from "../../../../context/Auth";
import LearnerClassroomAssignmentsPanel from "./ClassroomAssignmentsPanel/LearnerClassroomAssignmentsPanel";

const LearnerClassroom = () => {
  const { classroom }: { classroom: Classroom } = useContext(ClassroomContext);

  const { user }: any = useContext(AuthContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RemoveStudent
        isOpen={isOpen}
        onClose={onClose}
        student={user}
        classroom={classroom}
      />

      <Box mx={4}>
        <Link to={`/dashboard/classrooms`}>
          <Button my={4}>&lt;- All Classrooms</Button>
        </Link>

        {classroom.users?.some((x) => parseInt(x.id) === user.id) ? (
          <>
            <Heading>
              #{classroom.id} {classroom.name}
            </Heading>
            <Heading size={"sm"}>
              Created:{" "}
              {new Date(parseInt(classroom.createdAt)).toLocaleString()}
            </Heading>
            <Heading fontSize={"0.9em"}>
              {classroom.password === ""
                ? "public"
                : "private (password required to join)"}
            </Heading>
            <Heading size={"sm"}>
              Owner: {`${classroom.creator!.username}`}
            </Heading>

            <Center>
              <ButtonGroup>
                <CopyLink
                  link={
                    window.location.origin +
                    `/dashboard/classrooms/join/${classroom.id}`
                  }
                  text={"Copy Invite Link"}
                />
                <Button colorScheme={"red"} onClick={onOpen}>
                  Leave Classroom
                </Button>
              </ButtonGroup>
            </Center>

            <Tabs>
              <TabList>
                <Tab>Assignments</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <LearnerClassroomAssignmentsPanel />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        ) : (
          <Text textAlign={"center"}>
            You cannot view this classroom as a learner.
          </Text>
        )}
      </Box>
    </>
  );
};

export default LearnerClassroom;
