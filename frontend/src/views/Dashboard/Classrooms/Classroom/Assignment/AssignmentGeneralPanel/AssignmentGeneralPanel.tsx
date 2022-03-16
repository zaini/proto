import React, { useContext } from "react";
import { Button, ButtonGroup, Heading, Link } from "@chakra-ui/react";
import { Assignment, Problem } from "../../../../../../gql-types";
import { AssignmentContext } from "../Assignment";
import CustomTable from "../../../../../../components/CustomTable/CustomTable";

const AssignmentGeneralPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  return (
    <>
      {assignment.problems ? (
        <>
          <Heading>Problems</Heading>
          <br />
          <CustomTable
            data={assignment.problems.map((problem: Problem) => {
              return {
                id: problem.id,
                name: problem.specification.title,
                options: (
                  <ButtonGroup>
                    <Button
                      as={Link}
                      href={`/problems/${problem.id}`}
                      target={"_blank"}
                      colorScheme={"blue"}
                    >
                      Go to problem
                    </Button>
                    <Button colorScheme={"blue"}>Statistics</Button>
                  </ButtonGroup>
                ),
              };
            })}
            columns={[
              {
                Header: "ID",
                accessor: "id",
              },
              {
                Header: "Name",
                accessor: "name",
              },
              {
                Header: "Options",
                accessor: "options",
              },
            ]}
          />
        </>
      ) : (
        <Heading textAlign={"center"}>This assignment has no problems</Heading>
      )}
    </>
  );
};

export default AssignmentGeneralPanel;
