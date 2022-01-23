import React, { createContext, useContext, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import TestCaseView from "../TestCaseView/TestCaseView";
import { gql, useMutation } from "@apollo/client";
import EditorSettings from "./EditorSettings/EditorSettings";
import { ProblemContext } from "../../../views/Problem/Problem";

const EditorContext = createContext({
  selectedLanguage: -1,
  setSelectedLanguage: (x: any) => {},
  editorTheme: "",
  setEditorTheme: (x: any) => {},
  code: "",
});

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

const CodeEditor = () => {
  const problem = useContext(ProblemContext);

  const [code, setCode] = useState(problem.specification.initialCode);

  const [editorTheme, setEditorTheme] = useState<"dark" | "light">("dark");

  const [tabIndex, setTabIndex] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState(71);

  const [submitTests, { data, loading, error }] = useMutation(SUBMIT_TESTS, {
    onCompleted: ({ submitTests }) => {
      switch (submitTests.submissionType) {
        case "CUSTOM":
          // setCustomTestResults(submitTests.results);
          break;
        case "PROBLEM":
          // setProblemTestResults(submitTests.results);
          break;
        default:
          break;
      }
    },
  });

  return (
    <EditorContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage: (x: any) => {
          setSelectedLanguage(x);
        },
        editorTheme,
        setEditorTheme: (x: any) => {
          setSelectedLanguage(x);
        },
        code,
      }}
    >
      <CodeMirror
        value={code}
        height="600px"
        theme={editorTheme}
        extensions={[python()]}
        onChange={(value: any, viewUpdate: any) => {
          setCode(value);
        }}
      />
      <TestCaseView tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <EditorSettings />
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
                testCases: [],
                submissionType: "PROBLEM", // ideally I would use the Enum here but getting import errors
              },
            });
            setTabIndex(0);
          }}
        >
          Run All Tests
        </Button>
        <Button colorScheme={"green"}>Submit</Button>
      </ButtonGroup>
    </EditorContext.Provider>
  );
};

export { CodeEditor, EditorContext };
