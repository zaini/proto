import React, { useState } from "react";
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

const ProblemTestCaseTab = () => {
  const [problemTestCases, setProblemTestCases] = useState<TestCaseInput[]>([
    { id: "1", stdin: "10 22", expectedOutput: "32\n", isHidden: false },
    { id: "2", stdin: "10 20", expectedOutput: "30\n", isHidden: false },
    { id: "3", stdin: "70 20", expectedOutput: "90\n", isHidden: true },
  ]);
  const [problemTestResults, setProblemTestResults] = useState<
    TestCaseResult[]
  >([]);

  const testData: TestCaseResult[] = [];

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
