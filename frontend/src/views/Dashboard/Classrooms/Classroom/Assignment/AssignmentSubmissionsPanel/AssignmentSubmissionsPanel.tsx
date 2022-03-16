import React, { useContext } from "react";
import { AuthContext } from "../../../../../../context/Auth";
import { AccountType } from "../../../../../../utils";
import LearnerAssignmentSubmissionsPanel from "./LearnerAssignmentSubmissionsPanel";
import TeacherAssignmentSubmissionsPanel from "./TeacherAssignmentSubmissionsPanel";

const AssignmentSubmissionsPanel = () => {
  const { accountType }: any = useContext(AuthContext);

  return (
    <>
      {accountType === AccountType.Teacher ? (
        <TeacherAssignmentSubmissionsPanel />
      ) : (
        <LearnerAssignmentSubmissionsPanel />
      )}
    </>
  );
};

export default AssignmentSubmissionsPanel;
