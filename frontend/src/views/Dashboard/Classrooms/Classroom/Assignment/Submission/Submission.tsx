import React from "react";
import { useParams } from "react-router-dom";

const Submission = () => {
  const { classroomId, assignmentId, submissionId } = useParams();

  return (
    <div>
      submission {classroomId}, {assignmentId}, {submissionId}
    </div>
  );
};

export default Submission;
