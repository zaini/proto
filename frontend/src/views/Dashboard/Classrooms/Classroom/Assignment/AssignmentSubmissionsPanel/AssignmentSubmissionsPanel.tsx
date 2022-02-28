import React, { useContext } from "react";
import { Assignment } from "../../../../../../gql-types";
import { AssignmentContext } from "../Assignment";

const AssignmentSubmissionsPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  return <div>all submissions {assignment.id}</div>;
};

export default AssignmentSubmissionsPanel;
