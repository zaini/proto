import React, { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import EditorSettings from "./EditorSettings/EditorSettings";
import { ProblemContext } from "../../../views/Problem/Problem";
import { LangaugeCodeToLanguageSupport } from "../../../utils";
import Editor from "@monaco-editor/react";
import TestCaseView from "../TestCaseView/TestCaseView";

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

  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">(
    "vs-dark"
  );

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
      <Editor
        height="600px"
        language={LangaugeCodeToLanguageSupport[selectedLanguage]}
        value={code}
        theme={editorTheme}
        onChange={(value: any, event: any) => {
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
