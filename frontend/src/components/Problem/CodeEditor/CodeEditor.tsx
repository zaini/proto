import React, { createContext, useContext, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { Button } from "@chakra-ui/react";
import TestCaseView from "../TestCaseView/TestCaseView";
import { gql, useMutation } from "@apollo/client";
import EditorSettings from "./EditorSettings/EditorSettings";
import { ProblemContext } from "../../../views/Problem/Problem";
import { TestCaseInput } from "../../../gql-types";

const EditorContext = createContext({
  selectedLanguage: -1,
  setSelectedLanguage: (x: any) => {},
  editorTheme: "",
  setEditorTheme: (x: any) => {},
  code: "",
});

const CodeEditor = ({ submitTests }: any) => {
  const problem = useContext(ProblemContext);

  const [code, setCode] = useState(problem.specification.initialCode);

  const [editorTheme, setEditorTheme] = useState<"dark" | "light">("dark");

  const [tabIndex, setTabIndex] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState(71);

  return (
    <EditorContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage: (x: any) => {
          setSelectedLanguage(x);
        },
        editorTheme,
        setEditorTheme: (x: any) => {
          setEditorTheme(x);
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
      <Button
        colorScheme={"green"}
        my={2}
        mr={8}
        float="right"
        onClick={() => {
          submitTests({
            variables: {
              problemId: problem.id as String,
              language: selectedLanguage,
              code: code,
              // I have to do this mapping before for some reason the mutation does not work because testCases have properly "__typename"
              testCases: problem.specification.testCases!.map(
                (e: TestCaseInput) => {
                  return {
                    id: e.id,
                    expectedOutput: e.expectedOutput,
                    isHidden: e.isHidden,
                    stdin: e.stdin,
                  };
                }
              ),
            },
          });
        }}
      >
        Submit
      </Button>
    </EditorContext.Provider>
  );
};

export { CodeEditor, EditorContext };
