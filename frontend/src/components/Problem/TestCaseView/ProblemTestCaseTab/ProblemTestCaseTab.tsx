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
} from "@chakra-ui/react";
import { TestCase, TestCaseResult } from "../../../../gql-types";
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

const ProblemTestCaseTab = () => {
  const problem = useContext(ProblemContext);
  const { selectedLanguage, code } = useContext(EditorContext);

  const [testCaseData, setTestCaseData] = useState<TestCaseResult[]>([]);

  useEffect(() => {
    const testCases: TestCase[] = problem.specification.testCases!;
    setTestCaseData(
      testCases.map((e: TestCase) => {
        return {
          id: e.id,
          testCase: {
            id: e.id,
            expectedOutput: e.expectedOutput,
            isHidden: e.isHidden,
            stdin: e.stdin,
          },
          passed: false,
        };
      })
    );
  }, []);

  const [submitTests, { data, loading, error }] = useMutation(SUBMIT_TESTS, {
    onCompleted: ({ submitTests }) => {
      let results: TestCaseResult[] = submitTests.results;
      setTestCaseData(results);
    },
  });

  return (
    <>
      You must pass all these test cases before submitting.
      <br />
      Hidden testcases mean you cannot see the input or expected output.
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
        Run All Tests
      </Button>
      <Accordion allowMultiple>
        {testCaseData
          .sort((a, b) => parseInt(a.id) - parseInt(b.id))
          .map((e: TestCaseResult, i: number) => {
            return (
              <AccordionItem key={e.id}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Test #{i + 1}
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
                    {/* TODO run only a specific test rather than all the required tests */}
                    {/* <Button
                      float={"right"}
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
                    </Button> */}
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
