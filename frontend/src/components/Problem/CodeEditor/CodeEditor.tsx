import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { Box, Button, Select, IconButton } from "@chakra-ui/react";
import TestcaseView from "../TestcaseView/TestcaseView";
import { gql, useMutation } from "@apollo/client";
import { TestCaseInput, TestCaseResult } from "../../../../../gql-types";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
const SUBMIT_CUSTOM_TESTS = gql`
  mutation submitCustomTests(
    $problemId: ID!
    $code: String
    $language: Int
    $testCases: [TestCaseInput!]
  ) {
    submitCustomTests(
      problemId: $problemId
      code: $code
      language: $language
      testCases: $testCases
    ) {
      id
      passed
      stdout
      stderr
      time
      memory
      testCase {
        input
        expectedOutput
      }
    }
  }
`;

const CodeEditor = ({ problem }: any) => {
  const [code, setCode] = useState(problem.specification.initialCode);
  const [editorTheme, setEditorTheme] = useState<"dark" | "light">("dark");
  const [selectedLanguage, setSelectedLanguage] = useState(71);
  const [customTestData, setCustomTestData] = useState<TestCaseInput[]>([
    { id: "1", input: "5 2", expectedOutput: "7\n" },
    { id: "2", input: "1 2", expectedOutput: "3\n" },
    { id: "3", input: "7 2", expectedOutput: "9\n" },
  ]);
  const [customTestResults, setCustomTestResults] = useState<TestCaseResult[]>(
    []
  );

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
        height="600px"
        theme={editorTheme}
        extensions={[python()]}
        onChange={(value: any, viewUpdate: any) => {
          setCode(value);
        }}
      />
      <TestcaseView
        customTestData={customTestData}
        customTestResults={customTestResults}
      />
      {/* http://localhost:2358/languages/ */}
      Language:
      <Select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(parseInt(e.target.value))}
      >
        <option value={71}>Python (3.8.1)</option>
        <option value={70}>Python (2.7.17)</option>
        <option value={63}>JavaScript</option>
        <option value={74}>TypeScript</option>
      </Select>
      <Button
        onClick={async () => {
          await submitCustomTests({
            variables: {
              problemId: problem.id as String,
              language: selectedLanguage,
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
      <IconButton
        aria-label="Toggle editor theme"
        onClick={() =>
          setEditorTheme(editorTheme === "dark" ? "light" : "dark")
        }
        icon={editorTheme === "dark" ? <SunIcon /> : <MoonIcon />}
      />
    </Box>
  );
};

export default CodeEditor;
