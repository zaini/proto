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
} from "@chakra-ui/react";
import TestCaseSubmissionAccordionPanelContent from "../../TestCaseSubmissionAccordionPanelContent/TestCaseSubmissionAccordionPanelContent";

type Props = {
  submission: Submission;
};

const SubmissionModalStatistics = ({ submission }: Props) => {
  return (
    <Box>
      <Code fontSize={"lg"}>
        <b>time:</b> {new Date(parseInt(submission.createdAt)).toLocaleString()}
        ,
        <br /> <b>passed:</b> {`${submission.passed}`},
        <br />
        <b>avgTime:</b> {submission.avgTime.toFixed(2) + " ms"}, <br />
        <b>avgMemory:</b> {submission.avgMemory.toFixed(2) + " MB"}, <br />
        <b>language:</b> {LanguageCodeToName[submission.language]}
      </Code>
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
      <Heading size={"md"}>Test Case Results</Heading>
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
