import React from "react";
import { TestCaseSubmission } from "../../gql-types";
import { Box, Code, Textarea } from "@chakra-ui/react";

type Props = {
  testCaseSubmission: TestCaseSubmission;
  children?: any;
};

const TestCaseSubmissionAccordionPanelContent = ({
  testCaseSubmission,
  children,
}: Props) => {
  return (
    <Box>
      {!testCaseSubmission.testCase.isHidden && (
        <>
          Input: <Code>{testCaseSubmission.testCase.stdin}</Code>
          <br />
          Expected Output:{" "}
          <Code>{testCaseSubmission.testCase.expectedOutput}</Code>
          <br />
          💾{" "}
          <Code>
            {testCaseSubmission.memory
              ? testCaseSubmission.memory.toFixed(2) + " MB"
              : "N/A"}
          </Code>{" "}
          | 🕓{" "}
          <Code>
            {testCaseSubmission.time
              ? testCaseSubmission.time.toFixed(2) + " ms"
              : "N/A"}
          </Code>
          <br />
          Description: <Code>{testCaseSubmission.description || "N/A"}</Code>
          <br />
          Your Output: <Code>{testCaseSubmission.stdout || "N/A"}</Code>
          <br />
          {testCaseSubmission.stderr && (
            <>
              Errors:{" "}
              <Textarea readOnly>{testCaseSubmission.stderr || "N/A"}</Textarea>
              <br />
            </>
          )}
          {testCaseSubmission.compile_output && (
            <>
              Compiler Output:{" "}
              <Textarea readOnly>{testCaseSubmission.compile_output}</Textarea>
              <br />
            </>
          )}
        </>
      )}
      Passed: {testCaseSubmission.passed ? "✔" : "❌"}
      <br />
      {children}
    </Box>
  );
};

export default TestCaseSubmissionAccordionPanelContent;
