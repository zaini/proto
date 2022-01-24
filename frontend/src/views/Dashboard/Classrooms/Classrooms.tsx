import React from "react";
import { Box, Button, ButtonGroup, Heading, VStack } from "@chakra-ui/react";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { Link } from "react-router-dom";

const Classrooms = () => {
  return (
    <Box mx={4}>
      <Heading>Classrooms</Heading>
      <Button>Create Classroom</Button>
      <Box mt={4}>
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
              Header: "Created",
              accessor: "createdAt",
            },
            {
              Header: "Options",
              accessor: "options",
            },
          ]}
          data={[
            {
              classroomName: "FC2",
              numberOfStudents: 30,
              createdAt: new Date().toLocaleString(),
              options: (
                <ButtonGroup>
                  <Link to={`/dashboard/classrooms/${1}`}>
                    <Button colorScheme={"blue"}>View</Button>
                  </Link>
                  <Button colorScheme={"blue"}>Set Assignment</Button>
                  <Button colorScheme={"blue"}>Copy Invite Link</Button>
                </ButtonGroup>
              ),
            },
            {
              classroomName: "PPA",
              numberOfStudents: 24,
              createdAt: new Date().toLocaleString(),
              options: (
                <ButtonGroup>
                  <Link to={`/dashboard/classrooms/${2}`}>
                    <Button colorScheme={"blue"}>View</Button>
                  </Link>
                  <Button colorScheme={"blue"}>Set Assignment</Button>
                  <Button colorScheme={"blue"}>Copy Invite Link</Button>
                </ButtonGroup>
              ),
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default Classrooms;
