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
} from "@chakra-ui/react";
import { TestCaseInput, TestCaseResult } from "../../../../../gql-types";

type TestcaseViewProps = {
  customTestData: TestCaseInput[];
  customTestResults: TestCaseResult[];
};

const TestcaseView = ({
  customTestData,
  customTestResults,
}: TestcaseViewProps) => {
  let testData = customTestResults;
  if (testData.length === 0 || customTestResults === []) {
    testData = customTestData.map((e: TestCaseInput) => {
      return {
        id: e.id,
        testCase: e,
        passed: false,
      };
    });
  }

  return (
    <Tabs>
      <TabList>
        <Tab>All Test Cases</Tab>
        <Tab>Custom Test Cases</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Accordion allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Section 1 title
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Just go look at the custom tests intead...
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Section 2 title
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Just go look at the custom tests intead...
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </TabPanel>
        <TabPanel>
          <p>Custom Test Cases!</p>
          <Accordion allowMultiple>
            {testData.map((e: TestCaseResult, i: number) => {
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
                    Input: {e.testCase.input}
                    <br />
                    Expected Output: {e.testCase.expectedOutput}
                    {e.passed !== undefined && (
                      <Box>
                        💾 {e.memory ? e.memory + " bytes" : "N/A"} | 🕓{" "}
                        {e.time ? e.time + "ms" : "N/A"}
                        <br />
                        Your Output: {e.stdout || "N/A"}
                        <br />
                        Errors: {e.stderr || "N/A"}
                        <br />
                        Passed: {e.passed ? "✔" : "❌"}
                      </Box>
                    )}
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

export default TestcaseView;
