import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Code,
} from "@chakra-ui/react";
import { TestCaseInput, TestCaseResult } from "../../../../gql-types";

type ProblemTestCaseTabProps = {
  testData: TestCaseResult[];
};

const ProblemTestCaseTab = ({ testData }: ProblemTestCaseTabProps) => {
  return (
    <>
      <Accordion allowMultiple>
        {testData
          .sort((a, b) => parseInt(a.id) - parseInt(b.id))
          .map((e: TestCaseResult, i: number) => {
            return (
              <AccordionItem key={e.id}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Test #{e.id}{" "}
                      <Code>{e.testCase.isHidden && "hidden"}</Code>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box>
                    Input:{" "}
                    <Code>
                      {e.testCase.isHidden ? "hidden" : e.testCase.stdin}
                    </Code>
                    <br />
                    Expected Output:{" "}
                    <Code>
                      {e.testCase.isHidden
                        ? "hidden"
                        : e.testCase.expectedOutput}
                    </Code>
                    <br />
                    💾 <Code>{e.memory ? e.memory + " bytes" : "N/A"}</Code> |
                    🕓 <Code>{e.time ? e.time + " ms" : "N/A"}</Code>
                    <br />
                    Your Output: <Code>{e.stdout || "N/A"}</Code>
                    <br />
                    Errors: <Code>{e.stderr || "N/A"}</Code>
                    <br />
                    Passed: {e.passed ? "✔" : "❌"}
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
      </Accordion>
    </>
  );
};

export default ProblemTestCaseTab;
