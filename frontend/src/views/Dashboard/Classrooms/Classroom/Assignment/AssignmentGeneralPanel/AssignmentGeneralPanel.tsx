import React, { useContext } from "react";
import { Link } from "@chakra-ui/react";
import { Assignment, Problem } from "../../../../../../gql-types";
import { AssignmentContext } from "../Assignment";

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
    </>
  );
};

export default AssignmentGeneralPanel;
