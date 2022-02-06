import React, { useContext } from "react";
import { AuthContext } from "../../../context/Auth";
import { AccountType } from "../../../utils";
import TeacherClassrooms from "./TeacherClassrooms";
import LearnerClassrooms from "./LearnerClassrooms";

const Classrooms = () => {
  const { accountType }: any = useContext(AuthContext);

  if (accountType === AccountType.Teacher) {
    return <TeacherClassrooms />;
  }

  return <LearnerClassrooms />;
};

export default Classrooms;
