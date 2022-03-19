import React, { useContext } from "react";
import { Button, ButtonGroup, Heading, Link } from "@chakra-ui/react";
import { Assignment, Problem } from "../../../../../../gql-types";
import { AssignmentContext } from "../Assignment";
import CustomTable from "../../../../../../components/CustomTable/CustomTable";
import { AuthContext } from "../../../../../../context/Auth";
import { AccountType } from "../../../../../../utils";

const AssignmentGeneralPanel = ({ setTabIndex }: { setTabIndex?: any }) => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);
  const { user, accountType }: any = useContext(AuthContext);

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
                    {/* Teachers can click this to view statistics for the assignments problems by looking at the submissions tab */}
                    {accountType === AccountType.Teacher && (
                      <Button
                        colorScheme={"blue"}
                        onClick={() => setTabIndex(1)}
                      >
                        Submission Statistics
                      </Button>
                    )}
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
