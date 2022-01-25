import React, { useContext } from "react";
import { Assignment, Classroom, User } from "../../../../../gql-types";
import { Button, ButtonGroup, Center, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import CustomTable from "../../../../../components/CustomTable/CustomTable";
import { ClassroomContext } from "../Classroom";

const ClassroomAssignmentsPanel = () => {
  const { classroom: x } = useContext(ClassroomContext);
  const classroom: Classroom = x;

  return (
    <>
      {classroom.assignments && classroom.assignments.length > 0 ? (
        <CustomTable
          columns={[
            {
              Header: "Assignment ID",
              accessor: "assignmentId",
            },
            {
              Header: "Set Date",
              accessor: "setDate",
            },
            {
              Header: "Due Date",
              accessor: "dueDate",
            },
            {
              Header: "Submissions",
              accessor: "numberOfSubmissions",
            },

            {
              Header: "Options",
              accessor: "options",
            },
          ]}
          data={classroom.assignments.map(
            (assignment: Assignment, i: number) => {
              return {
                assignmentId: assignment.id,
                setDate: new Date(
                  parseInt(assignment.setDate)
                ).toLocaleString(),
                dueDate: new Date(
                  parseInt(assignment.dueDate)
                ).toLocaleString(),
                numberOfSubmissions: assignment.submissions
                  ? assignment.submissions.length
                  : 0,
                options: (
                  <ButtonGroup>
                    <Link to={`/dashboard/classrooms/${1}`}>
                      <Button colorScheme={"blue"}>View</Button>
                    </Link>
                    <Button colorScheme={"blue"}>View Submissions</Button>
                    <Button colorScheme={"red"}>Remove</Button>
                  </ButtonGroup>
                ),
              };
            }
          )}
        />
      ) : (
        <Center mb={8}>
          <Stack spacing={4}>
            <Text>This classroom does not have any assignments!</Text>
            <Button>Set Assignment</Button>
          </Stack>
        </Center>
      )}
    </>
  );
};

export default ClassroomAssignmentsPanel;