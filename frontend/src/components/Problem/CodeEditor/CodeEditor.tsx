import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import TestCaseView from "../TestCaseView/TestCaseView";
import { gql, useMutation } from "@apollo/client";
import { TestCaseInput, TestCaseResult } from "../../../gql-types";
import EditorSettings from "./EditorSettings/EditorSettings";

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
          isHidden
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
    { id: "1", stdin: "5 2", expectedOutput: "7\n", isHidden: false },
    { id: "2", stdin: "1 2", expectedOutput: "3\n", isHidden: false },
    { id: "3", stdin: "7 2", expectedOutput: "9\n", isHidden: false },
  ]);
  const [customTestResults, setCustomTestResults] = useState<TestCaseResult[]>(
    []
  );

  const [problemTestCases, setProblemTestCases] = useState<TestCaseInput[]>([
    { id: "1", stdin: "10 22", expectedOutput: "32\n", isHidden: false },
    { id: "2", stdin: "10 20", expectedOutput: "30\n", isHidden: false },
    { id: "3", stdin: "70 20", expectedOutput: "90\n", isHidden: true },
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

  const [tabIndex, setTabIndex] = useState(0);

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
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
      <EditorSettings
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        editorTheme={editorTheme}
        setEditorTheme={setEditorTheme}
      />
      <ButtonGroup my={2}>
        <Button
          colorScheme={"teal"}
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
            setTabIndex(0);
          }}
        >
          Run All Tests
        </Button>
        <Button
          colorScheme={"teal"}
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
            setTabIndex(1);
          }}
        >
          Run Custom Tests
        </Button>
        <Button colorScheme={"green"}>Submit</Button>
      </ButtonGroup>
    </Box>
  );
};

export default CodeEditor;
