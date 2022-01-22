import React, { useContext, useState } from "react";
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
  InputGroup,
  InputLeftAddon,
  Input,
  Stack,
  Text,
  Textarea,
  Center,
} from "@chakra-ui/react";
import { TestCaseInput, TestCaseResult } from "../../../../gql-types";
import { ProblemContext } from "../../../../views/Problem/Problem";

const CustomTestCaseTab = () => {
  const problem = useContext(ProblemContext);

  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");

  const [customTestCases, setCustomTestCases] = useState<TestCaseInput[]>([]);
  const [customTestResults, setCustomTestResults] = useState<TestCaseResult[]>(
    []
  );

  const addToCustomTestCases = () => {
    console.log("addToCustomTestCases", customInput, customOutput);
    // setCustomTestCases()
  };

  const removeFromCustomTestCases = () => {
    console.log("removeFromCustomTestCases", customInput, customOutput);
    // setCustomTestCases()
  };

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
                      <Button
                        colorScheme={"red"}
                        onClick={removeFromCustomTestCases}
                      >
                        Remove
                      </Button>
                    </ButtonGroup>
                    <br />
                    <br />
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        <Stack direction={"row"} mt={6}>
          <InputGroup>
            <InputLeftAddon children="Input" h="100%" />
            <Input
              as={Textarea}
              resize={"vertical"}
              placeholder="3 4"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
          </InputGroup>
          <Center>
            <Text>=&gt;</Text>
          </Center>
          <InputGroup>
            <InputLeftAddon children="Output" h="100%" />
            <Input
              as={Textarea}
              resize={"vertical"}
              placeholder="7"
              value={customOutput}
              onChange={(e) => setCustomOutput(e.target.value)}
            />
          </InputGroup>
          <Center>
            <Button
              disabled={testData.length >= 10}
              onClick={addToCustomTestCases}
            >
              Add Test
            </Button>
          </Center>
        </Stack>
      </Accordion>
    </>
  );
};

export default CustomTestCaseTab;
