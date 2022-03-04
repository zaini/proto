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
      Problems:
      <br />
      {assignment.problems?.map((problem: Problem) => {
        return (
          <Link key={problem.id} href={`/problems/${problem.id}`}>
            #{problem.id} {problem.specification.title}
          </Link>
        );
      })}
      Stats go here like average times, average memory, total submissions made,
      percentage of submissions that passed, number of submissions made over
      time, which test cases failed/passed the most. students and teachers can
      see that.
      <br />
      {assignment.problems ? (
        <>
          <Heading>Problems</Heading>
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
