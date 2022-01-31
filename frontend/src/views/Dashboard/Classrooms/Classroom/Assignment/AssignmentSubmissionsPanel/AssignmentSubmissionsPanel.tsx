import React from "react";
import { Assignment } from "../../../../../../gql-types";

const AssignmentSubmissionsPanel = ({
  assignment,
}: {
  assignment: Assignment;
}) => {
  return <div>all submissions {assignment.id}</div>;
};

export default AssignmentSubmissionsPanel;
