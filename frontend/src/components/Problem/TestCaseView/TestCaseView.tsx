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
import { TestCaseInput, TestCaseResult } from "../../../gql-types";

type TestCaseViewProps = {
  problemTestCases: TestCaseInput[];
  problemTestResults: TestCaseResult[];
  customTestCases: TestCaseInput[];
  customTestResults: TestCaseResult[];
};

const formatTestData = (
  testCaseInputs: TestCaseInput[],
  testCaseResults: TestCaseResult[]
) => {
  let testData = testCaseResults;
  if (testData.length === 0 || testData === []) {
    testData = testCaseInputs.map((e: TestCaseInput) => {
      return {
        id: e.id,
        testCase: e,
        passed: false,
      };
    });
  }
  return testData;
};

const TestCaseView = ({
  problemTestCases,
  problemTestResults,
  customTestCases,
  customTestResults,
}: TestCaseViewProps) => {
  let problemTestData = formatTestData(problemTestCases, problemTestResults);
  let customTestData = formatTestData(customTestCases, customTestResults);

  return (
    <Tabs>
      <TabList>
        <Tab>All Test Cases</Tab>
        <Tab>Custom Test Cases</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <p>All Test Cases</p>
          <Accordion allowMultiple>
            {problemTestData.map((e: TestCaseResult, i: number) => {
              return (
                <AccordionItem key={e.id}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Test #{e.id}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Box>
                      Input: <Code>{e.testCase.stdin}</Code>
                      <br />
                      Expected Output: <Code>{e.testCase.expectedOutput}</Code>
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
        </TabPanel>
        <TabPanel>
          <p>Custom Test Cases</p>
          <Accordion allowMultiple>
            {customTestData.map((e: TestCaseResult, i: number) => {
              return (
                <AccordionItem key={e.id}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Custom Test #{e.id}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Box>
                      Input: <Code>{e.testCase.stdin}</Code>
                      <br />
                      Expected Output: <Code>{e.testCase.expectedOutput}</Code>
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
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TestCaseView;
