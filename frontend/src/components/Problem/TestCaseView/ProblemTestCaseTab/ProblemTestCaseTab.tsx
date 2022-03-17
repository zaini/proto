import React, { useContext, useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Code,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { TestCaseInput, TestCaseSubmission } from "../../../../gql-types";
import { ProblemContext } from "../../../../views/Problem/Problem";
import { gql, useMutation } from "@apollo/client";
import { EditorContext } from "../../CodeEditor/CodeEditor";

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

const ProblemTestCaseTab = () => {
  const problem = useContext(ProblemContext);
  const { selectedLanguage, code } = useContext(EditorContext);
  const testCases: TestCaseInput[] = problem.specification.testCases!;

  const [testCaseAndSubmissions, setTestCaseAndSubmissions] = useState<any>(
    Object.fromEntries(
      testCases.map((testCase) => {
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
      setTestCaseAndSubmissions(Object.fromEntries(x));
    },
  });

  return (
    <>
      You must pass all these test cases before submitting.
      <br />
      Hidden testcases mean you cannot see the input or expected output.
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
              testCases: testCases.map((testCase) => {
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
        Run All Tests
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
                    {testCase.isHidden && "Hidden"} Test #{i + 1}
                  </Box>
                  <Box>{testCaseSubmittion.passed ? "✔" : "❌"}</Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box>
                  {!testCase.isHidden && (
                    <>
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
                      Your Output:{" "}
                      <Code>{testCaseSubmittion.stdout || "N/A"}</Code>
                      <br />
                      {testCaseSubmittion.stderr && (
                        <>
                          Errors:{" "}
                          <Textarea readOnly>
                            {testCaseSubmittion.stderr || "N/A"}
                          </Textarea>
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
                    </>
                  )}
                  Passed: {testCaseSubmittion.passed ? "✔" : "❌"}
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

export default ProblemTestCaseTab;
