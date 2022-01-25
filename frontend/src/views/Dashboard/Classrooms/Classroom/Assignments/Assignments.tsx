import React from "react";
import { useParams } from "react-router-dom";

const Assignments = () => {
  const { classroomId } = useParams();

  return <div>assignments for classroom {classroomId}</div>;
};

export default Assignments;
