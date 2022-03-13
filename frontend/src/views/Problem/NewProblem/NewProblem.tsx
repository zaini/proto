import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import NewProblemTestCases from "../../../components/Problem/NewProblemTestCases/NewProblemTestCases";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { TestCaseInput } from "../../../gql-types";
import { gql, useMutation } from "@apollo/client";

enum Difficulty {
  Easy = "EASY",
  Hard = "HARD",
  Medium = "MEDIUM",
}

const CREATE_PROBLEM = gql`
  mutation createProblem($specification: SpecificationInput!) {
    createProblem(specification: $specification) {
      id
    }
  }
`;

const NewProblem = () => {
  const [problemName, setProblemName] = useState("");
  const [difficulty, setDifficulty] = useState<string>(Difficulty.Easy);
  const [description, setDescription] = useState(
    "Add two numbers and return the result.\n\n## Example 1\n`Input: 1 2`\n\n`Output: 3`\n\n## Example 2\n`Input: 5 7`\n\n`Output: 12`"
  );
  const [testCases, setTestCases] = useState<TestCaseInput[]>([
    {
      id: `${1}`,
      expectedOutput: `7`,
      isHidden: false,
      stdin: `3 4`,
    },
  ]);

  const [createProblem] = useMutation(CREATE_PROBLEM, {
    onCompleted: ({ createProblem }) => {
      window.alert("New problem successfully created");
      window.location.href = `/problems/${createProblem.id}`;
    },
    onError(err) {
      const message =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        err.message;
      window.alert(`Failed to create new problem. \n\n${message}`);
    },
  });

  return (
    <Box px={"12.5%"} py={8}>
      <Heading>Create New Problem</Heading>
      <br />
      <Button
        colorScheme={"blue"}
        onClick={() =>
          createProblem({
            variables: {
              specification: {
                title: problemName,
                difficulty,
                testCases,
                description,
                initialCode: JSON.stringify({ 71: "code" }),
              },
            },
          })
        }
      >
        Create Problem
      </Button>
      <br />
      <br />
      <Stack>
        <InputGroup>
          <InputLeftAddon children="Name" />
          <Input
            type="text"
            placeholder="FizzBuzz"
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children="Difficulty" />
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {[Difficulty.Easy, Difficulty.Medium, Difficulty.Hard].map((x) => (
              <option value={x}>{x}</option>
            ))}
          </Select>
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children="Description" />
          <Tabs w={"100%"}>
            <TabList>
              <Tab>Markdown</Tab>
              <Tab>Preview</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  h={"md"}
                />
              </TabPanel>
              <TabPanel>
                <Box
                  minH={"md"}
                  border="1px"
                  borderColor={"inherit"}
                  borderRadius={4}
                  p={4}
                >
                  <ReactMarkdown components={ChakraUIRenderer()}>
                    {description}
                  </ReactMarkdown>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </InputGroup>
        <br />
        <Box>
          <Heading size={"md"}>Test Cases</Heading>
          <NewProblemTestCases
            testCases={testCases}
            setTestCases={setTestCases}
          />
        </Box>
      </Stack>
      <br />
      <Button
        colorScheme={"blue"}
        onClick={() =>
          createProblem({
            variables: {
              specification: {
                problemName,
                difficulty,
                testCases,
                description,
                initialCode: JSON.stringify({ 71: "code" }),
              },
            },
          })
        }
      >
        Create Problem
      </Button>
    </Box>
  );
};

export default NewProblem;
