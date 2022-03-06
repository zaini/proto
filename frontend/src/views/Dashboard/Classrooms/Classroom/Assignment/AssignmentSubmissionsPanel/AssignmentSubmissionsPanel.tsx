import React, { useContext } from "react";
import { AuthContext } from "../../../../../../context/Auth";
import { Assignment } from "../../../../../../gql-types";
import { AccountType } from "../../../../../../utils";
import { AssignmentContext } from "../Assignment";
import LearnerAssignmentSubmissionsPanel from "./LearnerAssignmentSubmissionsPanel";
import TeacherAssignmentSubmissionsPanel from "./TeacherAssignmentSubmissionsPanel";

const AssignmentSubmissionsPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  const { accountType }: any = useContext(AuthContext);

  return (
    <>
      all submissions {assignment.id}
      {accountType === AccountType.Teacher ? (
        <TeacherAssignmentSubmissionsPanel />
      ) : (
        <LearnerAssignmentSubmissionsPanel />
      )}
    </>
  );
};

export default AssignmentSubmissionsPanel;
