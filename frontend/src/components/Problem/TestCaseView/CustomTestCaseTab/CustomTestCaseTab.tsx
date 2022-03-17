import React, { useContext, useEffect, useState } from "react";
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
import { ProblemContext } from "../../../../views/Problem/Problem";
import { gql, useMutation } from "@apollo/client";
import { EditorContext } from "../../CodeEditor/CodeEditor";
import { TestCaseInput, TestCaseSubmission } from "../../../../gql-types";

const SUBMIT_TESTS = gql`
  mutation submitTests(
    $code: String!
    $language: Int!
    $testCases: [TestCaseInput!]!
  ) {
    submitTests(code: $code, language: $language, testCases: $testCases) {
      id
      passed
      stdout
      stderr
      compile_output
      time
      description
      memory
      testCase {
        stdin
        expectedOutput
        isHidden
      }
    }
  }
`;

const CustomTestCaseTab = () => {
  const problem = useContext(ProblemContext);
  const { selectedLanguage, code } = useContext(EditorContext);

  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");

  const [customTestCases, setCustomTestCases] = useState<any>([]);
  const [testCaseAndSubmissions, setTestCaseAndSubmissions] = useState<any>({});

  useEffect(() => {
    setTestCaseAndSubmissions(
      Object.fromEntries(
        customTestCases.map((testCase: TestCaseInput) => {
          return [
            JSON.stringify({
              stdin: testCase.stdin,
              expectedOutput: testCase.expectedOutput,
              isHidden: testCase.isHidden,
            }),
            {
              id: null,
              memory: null,
              passed: false,
              stderr: null,
              description: null,
              stdout: null,
              time: null,
              testCase,
            },
          ];
        })
      )
    );
  }, [customTestCases]);

  const addToCustomTestCases = () => {
    if (customTestCases.length >= 10) {
      window.alert(
        "You can only have up to 10 custom tests. You must remove a test before adding another."
      );
      return;
    }
    let cases = customTestCases;
    cases.push({
      expectedOutput: customOutput,
      isHidden: false,
      stdin: customInput,
    });
    setCustomTestCases([...cases]);
    setCustomInput("");
    setCustomOutput("");
  };

  const removeFromCustomTestCases = (i: number) => {
    let cases = customTestCases;
    cases.splice(i, 1);
    setCustomTestCases([...cases]);
  };

  const [submitTests, { data, loading, error }] = useMutation(SUBMIT_TESTS, {
    onCompleted: ({ submitTests }) => {
      const x = submitTests.map((testCaseSubmission: TestCaseSubmission) => {
        const testCase = testCaseSubmission.testCase;
        return [
          JSON.stringify({
            stdin: testCase.stdin,
            expectedOutput: testCase.expectedOutput,
            isHidden: testCase.isHidden,
          }),
          testCaseSubmission,
        ];
      });

      const a: any = {
        ...testCaseAndSubmissions,
        ...Object.fromEntries(x),
      };

      setTestCaseAndSubmissions(a);
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
              language: selectedLanguage,
              code,
              testCases: customTestCases.map((testCase: TestCaseInput) => {
                return {
                  stdin: testCase.stdin,
                  expectedOutput: testCase.expectedOutput,
                  isHidden: testCase.isHidden,
                };
              }),
            },
          });
        }}
      >
        Run Custom Tests
      </Button>
      <br />
      <br />
      <Accordion allowMultiple>
        {Object.keys(testCaseAndSubmissions).map((testCaseString, i) => {
          const testCase: TestCaseInput = JSON.parse(testCaseString);
          const testCaseSubmittion: TestCaseSubmission =
            testCaseAndSubmissions[testCaseString];

          return (
            <AccordionItem key={i}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Custom Test #{i + 1}
                  </Box>
                  <Box>{testCaseSubmittion.passed ? "✔" : "❌"}</Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box>
                  Input: <Code>{testCase.stdin}</Code>
                  <br />
                  Expected Output: <Code>{testCase.expectedOutput}</Code>
                  <br />
                  💾{" "}
                  <Code>
                    {testCaseSubmittion.memory
                      ? testCaseSubmittion.memory.toFixed(2) + " MB"
                      : "N/A"}
                  </Code>{" "}
                  | 🕓{" "}
                  <Code>
                    {testCaseSubmittion.time
                      ? testCaseSubmittion.time.toFixed(2) + " ms"
                      : "N/A"}
                  </Code>
                  <br />
                  Description:{" "}
                  <Code>{testCaseSubmittion.description || "N/A"}</Code>
                  <br />
                  Your Output: <Code>{testCaseSubmittion.stdout || "N/A"}</Code>
                  <br />
                  {testCaseSubmittion.stderr && (
                    <>
                      Errors: <Code>{testCaseSubmittion.stderr || "N/A"}</Code>
                      <br />
                    </>
                  )}
                  {testCaseSubmittion.compile_output && (
                    <>
                      Compiler Output:{" "}
                      <Textarea readOnly>
                        {testCaseSubmittion.compile_output}
                      </Textarea>
                      <br />
                    </>
                  )}
                  Passed: {testCaseSubmittion.passed ? "✔" : "❌"}
                  <ButtonGroup float={"right"}>
                    <Button
                      colorScheme={"teal"}
                      isLoading={loading}
                      onClick={() => {
                        submitTests({
                          variables: {
                            language: selectedLanguage,
                            code,
                            testCases: [
                              {
                                stdin: testCase.stdin,
                                expectedOutput: testCase.expectedOutput,
                                isHidden: testCase.isHidden,
                              },
                            ],
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
              disabled={customTestCases.length >= 10}
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
