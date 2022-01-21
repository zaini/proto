import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Code,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { TestCaseInput, TestCaseResult } from "../../../../gql-types";

type CustomTestCaseTabProps = {
  testData: TestCaseResult[];
};

const CustomTestCaseTab = ({ testData }: CustomTestCaseTabProps) => {
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
                    <ButtonGroup float={"right"}>
                      <Button colorScheme={"teal"}>Run</Button>
                      <Button colorScheme={"red"}>Remove</Button>
                    </ButtonGroup>
                    <br />
                    <br />
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
      </Accordion>
    </>
  );
};

export default CustomTestCaseTab;
