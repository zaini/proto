import React, { useContext } from "react";
import { Assignment, Classroom } from "../../../../../gql-types";
import { Button, ButtonGroup, Center, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import CustomTable from "../../../../../components/CustomTable/CustomTable";
import { ClassroomContext } from "../Classroom";

const ClassroomAssignmentsPanel = ({ onOpen }: any) => {
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
                setDate: new Date(
                  parseInt(assignment.setDate)
                ).toLocaleString(),
                dueDate: new Date(
                  parseInt(assignment.dueDate)
                ).toLocaleString(),
                numberOfSubmissions:
                  assignment.submissions &&
                  assignment.submissions !== [] &&
                  classroom.users &&
                  classroom.users !== []
                    ? `${assignment.submissions.length}/${classroom.users.length}`
                    : "0/0",
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
            <Button onClick={onOpen}>Set Assignment</Button>
          </Stack>
        </Center>
      )}
    </>
  );
};

export default ClassroomAssignmentsPanel;
