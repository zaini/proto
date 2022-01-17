import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { Box, Button } from "@chakra-ui/react";
import TestcaseView from "../TestcaseView/TestcaseView";
import { gql, useMutation } from "@apollo/client";

const SUBMIT_CUSTOM_TESTS = gql`
  mutation submitCustomTests(
    $problemId: ID!
    $code: String
    $testCases: [TestCase!]
  ) {
    submitCustomTests(
      problemId: $problemId
      code: $code
      testCases: $testCases
    ) {
      id
      passed
    }
  }
`;

const CodeEditor = ({ problem }: any) => {
  const [code, setCode] = useState(problem.specification.initialCode);
  const [customTestData, setCustomTestData] = useState([
    { id: 0, input: "5 2", expectedOutput: "7" },
  ]);
  const [customTestResults, setCustomTestResults] = useState([
    { id: 0, passed: false },
  ]);

  const [submitCustomTests, { data, loading, error }] = useMutation(
    SUBMIT_CUSTOM_TESTS,
    {
      onCompleted({ submitCustomTests }) {
        setCustomTestResults(submitCustomTests);
      },
    }
  );

  //   const [submitAllTests, { data, loading, error }] =
  //     useMutation(SUBMIT_CUSTOM_TESTS);
  //   const [submitSolution, { data, loading, error }] =
  //     useMutation(SUBMIT_ALL_TESTS);

  return (
    <Box>
      <CodeMirror
        value={code}
        height="1000px"
        extensions={[python()]}
        onChange={(value: any, viewUpdate: any) => {
          setCode(value);
        }}
      />
      <TestcaseView
        customTestData={customTestData}
        customTestResults={customTestResults}
      />
      <Button
        onClick={async () => {
          await submitCustomTests({
            variables: {
              problemId: problem.id as String,
              code: code,
              testCases: customTestData,
            },
          });
        }}
      >
        Run Custom Tests
      </Button>
      <Button>Run All Tests</Button>
      <Button>Submit</Button>
    </Box>
  );
};

export default CodeEditor;
