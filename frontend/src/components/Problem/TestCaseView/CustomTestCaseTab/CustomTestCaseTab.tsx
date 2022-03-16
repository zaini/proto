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
import { TestCaseResult } from "../../../../gql-types";
import { ProblemContext } from "../../../../views/Problem/Problem";
import { gql, useMutation } from "@apollo/client";
import { EditorContext } from "../../CodeEditor/CodeEditor";

const SUBMIT_TESTS = gql`
  mutation submitTests(
    $problemId: ID!
    $code: String
    $language: Int
    $testCases: [TestCaseInput!]
  ) {
    submitTests(
      problemId: $problemId
      code: $code
      language: $language
      testCases: $testCases
    ) {
      results {
        id
        passed
        stdout
        stderr
        time
        memory
        testCase {
          stdin
          expectedOutput
          isHidden
        }
      }
    }
  }
`;

const CustomTestCaseTab = () => {
  const problem = useContext(ProblemContext);
  const { selectedLanguage, code } = useContext(EditorContext);

  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");

  const [testCaseData, setTestCaseData] = useState<TestCaseResult[]>([]);

  const addToCustomTestCases = () => {
    if (testCaseData.length >= 10) {
      window.alert(
        "You can only have up to 10 custom tests. You must remove a test before adding another."
      );
      return;
    }
    let cases = testCaseData;
    cases.push({
      id: `${cases.length + 1}`,
      testCase: {
        id: `${cases.length + 1}`,
        expectedOutput: customOutput,
        isHidden: false,
        stdin: customInput,
      },
      passed: false,
    });
    setTestCaseData([...cases]);
    setCustomInput("");
    setCustomOutput("");
  };

  const removeFromCustomTestCases = (i: number) => {
    let cases = testCaseData;
    cases.splice(i, 1);
    cases.forEach((e, i) => (e.id = `${i + 1}`));
    setTestCaseData([...cases]);
  };

  const [submitTests, { data, loading, error }] = useMutation(SUBMIT_TESTS, {
    onCompleted: ({ submitTests }) => {
      let results: TestCaseResult[] = submitTests.results;
      let merged: TestCaseResult[] = [];
      // TODO major bug: testCaseData for some reason isn't the actual state at this point. It's just the first value that is part of the state or empty
      testCaseData.forEach((testCase: TestCaseResult, i: number) => {
        const result = results.find((e) => e.id === testCase.id);
        if (result === undefined) {
          merged.push(testCase);
        } else {
          merged.push(result);
        }
      });
      // setTestCaseData(merged);
      setTestCaseData(results);
    },
  });

  return (
    <>
      You can create and run up to 10 of your own test cases here.
      <br />
      <br />
      <Button
        colorScheme={"teal"}
        isLoading={loading}
        onClick={() => {
          submitTests({
            variables: {
              problemId: problem.id as String,
              language: selectedLanguage,
              code: code,
              testCases: testCaseData.map((e) => e.testCase),
            },
          });
        }}
      >
        Run Custom Tests
      </Button>
      <br />
      <br />
      <Accordion allowMultiple>
        {testCaseData
          .sort((a, b) => parseInt(a.id) - parseInt(b.id))
          .map((e: TestCaseResult, i: number) => {
            return (
              <AccordionItem key={e.id}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Custom Test #{i + 1}
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
                    💾{" "}
                    <Code>
                      {e.memory ? e.memory.toFixed(2) + " MB" : "N/A"}
                    </Code>{" "}
                    | 🕓{" "}
                    <Code>{e.time ? e.time.toFixed(2) + " ms" : "N/A"}</Code>
                    <br />
                    Your Output: <Code>{e.stdout || "N/A"}</Code>
                    <br />
                    Errors: <Code>{e.stderr || "N/A"}</Code>
                    <br />
                    Passed: {e.passed ? "✔" : "❌"}
                    <ButtonGroup float={"right"}>
                      <Button
                        colorScheme={"teal"}
                        isLoading={loading}
                        onClick={() => {
                          submitTests({
                            variables: {
                              problemId: problem.id as String,
                              language: selectedLanguage,
                              code,
                              testCases: [e.testCase],
                            },
                          });
                        }}
                      >
                        Run
                      </Button>
                      <Button
                        isLoading={loading}
                        colorScheme={"red"}
                        onClick={() => removeFromCustomTestCases(i)}
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
              isLoading={loading}
              disabled={testCaseData.length >= 10}
              onClick={() => addToCustomTestCases()}
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
