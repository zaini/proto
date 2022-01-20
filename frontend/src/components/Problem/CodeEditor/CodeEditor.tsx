import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { Box, Button, Select, IconButton } from "@chakra-ui/react";
import TestCaseView from "../TestCaseView/TestCaseView";
import { gql, useMutation } from "@apollo/client";
import { TestCaseInput, TestCaseResult } from "../../../gql-types";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const SUBMIT_TESTS = gql`
  mutation submitTests(
    $problemId: ID!
    $code: String
    $language: Int
    $testCases: [TestCaseInput!]
    $submissionType: SubmissionType
  ) {
    submitTests(
      problemId: $problemId
      code: $code
      language: $language
      testCases: $testCases
      submissionType: $submissionType
    ) {
      results {
        id
        passed
        stdout
        stderr
        time
        memory
        testCase {
          stdin
          expectedOutput
        }
      }
      submissionType
    }
  }
`;

const CodeEditor = ({ problem }: any) => {
  const [code, setCode] = useState(problem.specification.initialCode);

  const [editorTheme, setEditorTheme] = useState<"dark" | "light">("dark");

  const [selectedLanguage, setSelectedLanguage] = useState(71);

  const [customTestCases, setCustomTestCases] = useState<TestCaseInput[]>([
    { id: "1", stdin: "5 2", expectedOutput: "7\n" },
    { id: "2", stdin: "1 2", expectedOutput: "3\n" },
    { id: "3", stdin: "7 2", expectedOutput: "9\n" },
  ]);
  const [customTestResults, setCustomTestResults] = useState<TestCaseResult[]>(
    []
  );

  const [problemTestCases, setProblemTestCases] = useState<TestCaseInput[]>([
    { id: "1", stdin: "10 22", expectedOutput: "32\n" },
    { id: "2", stdin: "10 20", expectedOutput: "30\n" },
    { id: "3", stdin: "70 20", expectedOutput: "90\n" },
  ]);
  const [problemTestResults, setProblemTestResults] = useState<
    TestCaseResult[]
  >([]);

  const [submitTests, { data, loading, error }] = useMutation(SUBMIT_TESTS, {
    onCompleted: ({ submitTests }) => {
      switch (submitTests.submissionType) {
        case "CUSTOM":
          setCustomTestResults(submitTests.results);
          break;
        case "PROBLEM":
          setProblemTestResults(submitTests.results);
          break;
        default:
          break;
      }
    },
  });

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
      <TestCaseView
        problemTestCases={problemTestCases}
        problemTestResults={problemTestResults}
        customTestCases={customTestCases}
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
        isLoading={loading}
        onClick={() => {
          submitTests({
            variables: {
              problemId: problem.id as String,
              language: selectedLanguage,
              code: code,
              testCases: customTestCases,
              submissionType: "CUSTOM", // ideally I would use the Enum here but getting import errors
            },
          });
        }}
      >
        Run Custom Tests
      </Button>
      <Button
        isLoading={loading}
        onClick={() => {
          submitTests({
            variables: {
              problemId: problem.id as String,
              language: selectedLanguage,
              code: code,
              testCases: problemTestCases,
              submissionType: "PROBLEM", // ideally I would use the Enum here but getting import errors
            },
          });
        }}
      >
        Run All Tests
      </Button>
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
