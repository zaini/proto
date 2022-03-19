import React from "react";
import { Submission } from "../../../gql-types";
import Editor from "@monaco-editor/react";
import {
  LangaugeCodeToLanguageSupport,
  LanguageCodeToName,
} from "../../../utils";
import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Code,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import TestCaseSubmissionAccordionPanelContent from "../../TestCaseSubmissionAccordionPanelContent/TestCaseSubmissionAccordionPanelContent";

type Props = {
  submission: Submission;
};

const SubmissionModalStatistics = ({ submission }: Props) => {
  const passedTestCases = submission.testCaseSubmissions.reduce(
    (total, submission) => total + (submission.passed ? 1 : 0),
    0
  );

  return (
    <Box>
      <Box fontSize={16}>
        <Text>
          <b>Passed:</b> {submission.passed ? "✔" : "❌"}
        </Text>
        <Text>
          <Tooltip label={"Created at"}>🕓</Tooltip>{" "}
          {new Date(parseInt(submission.createdAt)).toLocaleString()}
        </Text>
        <Text>
          <Tooltip label={"Average Runtime"}>⏳</Tooltip>{" "}
          {submission.avgTime.toFixed(2) + " ms"}
        </Text>
        <Text>
          <Tooltip label={"Average Memory Usage"}>💾</Tooltip>{" "}
          {submission.avgMemory.toFixed(2) + " MB"}
        </Text>
        <Text>
          <b>Language:</b> {LanguageCodeToName[submission.language]}
        </Text>
      </Box>

      <br />
      <br />
      <Editor
        height="400px"
        language={LangaugeCodeToLanguageSupport[submission.language]}
        value={submission.code}
        theme={"vs-dark"}
        options={{ readOnly: true }}
      />
      <br />
      <Heading size={"md"}>
        Test Case Results ({passedTestCases}/
        {submission.testCaseSubmissions.length})
      </Heading>
      <br />
      <Accordion allowMultiple>
        {submission.testCaseSubmissions.map((testCaseSubmission, i) => {
          return (
            <AccordionItem key={i}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {testCaseSubmission.testCase.isHidden && "Hidden"} Test #
                    {i + 1}
                  </Box>
                  <Box>{testCaseSubmission.passed ? "✔" : "❌"}</Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <TestCaseSubmissionAccordionPanelContent
                  testCaseSubmission={testCaseSubmission}
                />
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Box>
  );
};

export default SubmissionModalStatistics;
