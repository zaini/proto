import React, { useContext } from "react";
import { Assignment } from "../../../../../../gql-types";
import { AssignmentContext } from "../Assignment";

const AssignmentGeneralPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  return <div>general</div>;
};

export default AssignmentGeneralPanel;
