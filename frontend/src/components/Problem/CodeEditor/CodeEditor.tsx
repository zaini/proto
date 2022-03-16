import React, { createContext, useContext, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { Button } from "@chakra-ui/react";
import TestCaseView from "../TestCaseView/TestCaseView";
import EditorSettings from "./EditorSettings/EditorSettings";
import { ProblemContext } from "../../../views/Problem/Problem";

const EditorContext = createContext({
  selectedLanguage: -1,
  setSelectedLanguage: (x: any) => {},
  editorTheme: "",
  setEditorTheme: (x: any) => {},
  code: "",
});

const CodeEditor = ({ submitProblem, loading, openSubmissionsTab }: any) => {
  const problem = useContext(ProblemContext);

  const [selectedLanguage, setSelectedLanguage] = useState(
    parseInt(Object.keys(problem.specification.initialCode)[0])
  );

  const [code, setCode] = useState(
    problem.specification.initialCode[selectedLanguage]
  );

  const [editorTheme, setEditorTheme] = useState<"dark" | "light">("dark");

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setCode(problem.specification.initialCode[selectedLanguage]);
  }, [selectedLanguage]);

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
      <EditorSettings />
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

      <Button
        colorScheme={"green"}
        my={2}
        mr={8}
        isLoading={loading}
        size={"lg"}
        float="right"
        onClick={() => {
          submitProblem({
            variables: {
              problemId: problem.id as String,
              language: selectedLanguage,
              code: code,
            },
          });
          openSubmissionsTab();
        }}
      >
        Submit
      </Button>
    </EditorContext.Provider>
  );
};

export { CodeEditor, EditorContext };
