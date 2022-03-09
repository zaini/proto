import React from "react";
import { Submission } from "../../../gql-types";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

type Props = {
  submission: Submission;
};

const SubmissionModalStatistics = ({ submission }: Props) => {
  return (
    <>
      {JSON.stringify({
        time: new Date(parseInt(submission.createdAt)).toLocaleString(),
        passed: `${submission.passed}`,
        avgTime: submission.avgTime.toFixed(2) + " ms",
        avgMemory: submission.avgMemory.toFixed(2) + " MB",
        language: submission.language,
      })}
      <CodeMirror
        value={submission.code}
        editable={false}
        height="600px"
        theme={"dark"}
        extensions={[python()]}
      />
    </>
  );
};

export default SubmissionModalStatistics;
