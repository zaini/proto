import React from "react";
import { useParams } from "react-router-dom";

const Submissions = () => {
  const { classroomId, assignmentId } = useParams();

  return (
    <div>
      submissions {classroomId}, {assignmentId}
    </div>
  );
};

export default Submissions;
