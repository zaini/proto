import React, { useEffect, useState } from "react";
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
  Text,
  IconButton,
} from "@chakra-ui/react";
import { Select as MultiSelect } from "chakra-react-select";
import NewProblemTestCases from "../../../components/Problem/NewProblemTestCases/NewProblemTestCases";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { TestCaseInput } from "../../../gql-types";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { LanguageCodeToName } from "../../../utils";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

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

const GET_DEFAULT_INITIAL_CODE = gql`
  query getDefaultInitialCodes {
    getDefaultInitialCodes
  }
`;

// By default we are showing some made up problem with Python as the chosen language
const NewProblem = () => {
  const [defaultInitialCode, setDefaultInitialCode] = useState<any>({});
  const [tabIndex, setTabIndex] = useState(0);
  const [editorTheme, setEditorTheme] = useState<"dark" | "light">("dark");
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
  const [initialCode, setInitialCode] = useState<any>({});
  const [selectedLanguages, setSelectedLanguages] = useState<any>([
    { label: LanguageCodeToName[71], value: "71" },
  ]);

  const [getDefaultInitialCodes, { loading, error, data }] = useLazyQuery(
    GET_DEFAULT_INITIAL_CODE,
    {
      onCompleted: ({ getDefaultInitialCodes }) => {
        const defaults = JSON.parse(getDefaultInitialCodes);
        setDefaultInitialCode(defaults);
        setInitialCode({
          71: defaults[71],
        });
      },
    }
  );

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

  useEffect(() => {
    getDefaultInitialCodes();
  }, []);

  const createProblemButton = (
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
              initialCode: JSON.stringify(initialCode),
            },
          },
        })
      }
    >
      Create Problem
    </Button>
  );

  return (
    <Box px={"12.5%"} py={8}>
      <Heading>Create New Problem</Heading>
      <br />
      {createProblemButton}
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
        <br />
        <Box>
          <Heading size={"md"}>Language Support</Heading>
          <Text>
            Select the languages you would like to support and write the
            boilerplate code you want to provide. Read the help guide for
            guidance.
          </Text>
          <br />
          <MultiSelect
            colorScheme="blue"
            isMulti
            value={selectedLanguages}
            onChange={(e) => {
              if (e.length > selectedLanguages.length) {
                let addedLanguage = e.filter(
                  (x: any) => !selectedLanguages.includes(x)
                )[0];
                setSelectedLanguages(e);
                let copyInitialCode: any = initialCode;
                copyInitialCode[addedLanguage.value] =
                  defaultInitialCode[addedLanguage.value] || "";
                setInitialCode(copyInitialCode);
              } else {
                let removedLanguage = selectedLanguages.filter(
                  (x: any) => !e.includes(x)
                )[0];
                if (
                  removedLanguage.value in initialCode &&
                  initialCode[removedLanguage.value] !== "" &&
                  initialCode[removedLanguage.value] !==
                    defaultInitialCode[removedLanguage.value]
                ) {
                  if (
                    window.confirm(
                      "Removing this language will clear any code written for it. Are you sure you want to remove it?"
                    )
                  ) {
                    delete initialCode[removedLanguage.value];
                    setSelectedLanguages(e);
                  }
                } else {
                  delete initialCode[removedLanguage.value];
                  setSelectedLanguages(e);
                }
                setTabIndex(0);
              }
            }}
            options={Object.entries(LanguageCodeToName).map(([code, name]) => {
              return { label: name, value: code };
            })}
          />
          <br />
          {selectedLanguages.length > 0 && (
            <>
              <Tabs
                index={tabIndex}
                onChange={(index) => {
                  setTabIndex(index);
                }}
              >
                <TabList>
                  {selectedLanguages.map(({ label, value: code }: any) => {
                    return <Tab key={code}>{label}</Tab>;
                  })}
                </TabList>
                <TabPanels>
                  {selectedLanguages.map(({ label, value: code }: any) => {
                    return (
                      <TabPanel key={code}>
                        <IconButton
                          aria-label="Toggle editor theme"
                          onClick={() =>
                            setEditorTheme(
                              editorTheme === "dark" ? "light" : "dark"
                            )
                          }
                          icon={
                            editorTheme === "dark" ? <SunIcon /> : <MoonIcon />
                          }
                        />
                        <br />
                        <br />
                        <CodeMirror
                          value={initialCode[code]}
                          height="450px"
                          theme={editorTheme}
                          extensions={[python()]}
                          onChange={(value: any, viewUpdate: any) => {
                            let copyInitialCode: any = initialCode;
                            copyInitialCode[code] = value;
                            setInitialCode(copyInitialCode);
                          }}
                        />
                      </TabPanel>
                    );
                  })}
                </TabPanels>
              </Tabs>
            </>
          )}
        </Box>
      </Stack>
      <br />
      {createProblemButton}
    </Box>
  );
};

export default NewProblem;
