import React from "react";
import { useParams } from "react-router-dom";

const Assignment = () => {
  const { classroomId, assignmentId } = useParams();

  return (
    <div>
      classroom {classroomId}, assignment {assignmentId}
    </div>
  );
};

export default Assignment;
