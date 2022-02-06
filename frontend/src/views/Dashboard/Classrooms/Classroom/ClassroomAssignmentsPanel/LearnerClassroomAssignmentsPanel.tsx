import React, { useContext } from "react";
import { Assignment, Classroom } from "../../../../../gql-types";
import { Button, ButtonGroup, Center, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import CustomTable from "../../../../../components/CustomTable/CustomTable";
import { ClassroomContext } from "../Classroom";

const LearnerClassroomAssignmentsPanel = () => {
  const { classroom: x } = useContext(ClassroomContext);
  const classroom: Classroom = x;

  return (
    <>
      {classroom.assignments && classroom.assignments.length > 0 ? (
        <CustomTable
          columns={[
            {
              Header: "ID",
              accessor: "assignmentId",
            },
            {
              Header: "Name",
              accessor: "assignmentName",
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
              Header: "Problems",
              accessor: "numberOfProblems",
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
                assignmentName: assignment.name,
                setDate: new Date(
                  parseInt(assignment.setDate)
                ).toLocaleString(),
                dueDate: new Date(
                  parseInt(assignment.dueDate)
                ).toLocaleString(),
                numberOfProblems: assignment.problems
                  ? assignment.problems.length
                  : 0,
                options: (
                  <ButtonGroup>
                    <Link
                      to={`/dashboard/classrooms/${classroom.id}/assignments/${assignment.id}`}
                    >
                      <Button colorScheme={"blue"}>View</Button>
                    </Link>
                    <Link
                      to={`/dashboard/classrooms/${classroom.id}/assignments/${assignment.id}/submissions`}
                    >
                      <Button colorScheme={"blue"}>Submissions</Button>
                    </Link>
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
          </Stack>
        </Center>
      )}
    </>
  );
};

export default LearnerClassroomAssignmentsPanel;
