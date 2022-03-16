import React from "react";
import { Submission } from "../../../gql-types";
import Editor from "@monaco-editor/react";
import { LangaugeCodeToLanguageSupport } from "../../../utils";

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
      <Editor
        height="600px"
        language={LangaugeCodeToLanguageSupport[submission.language]}
        value={submission.code}
        theme={"vs-dark"}
        options={{ readOnly: true }}
      />
    </>
  );
};

export default SubmissionModalStatistics;
