import React, { useState } from "react";
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
  Checkbox,
} from "@chakra-ui/react";
import { TestCaseInput } from "../../../gql-types";

const NewProblemTestCases = ({
  testCases,
  setTestCases,
}: {
  testCases: TestCaseInput[];
  setTestCases: any;
}) => {
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  const addToCustomTestCases = () => {
    let cases = testCases;
    cases.push({
      id: `${cases.length + 1}`,
      expectedOutput: customOutput,
      isHidden: isHidden,
      stdin: customInput,
    });
    setTestCases([...cases]);
    setCustomInput("");
    setCustomOutput("");
  };

  const removeFromCustomTestCases = (i: number) => {
    let cases = testCases;
    cases.splice(i, 1);
    cases.forEach((e, i) => (e.id = `${i + 1}`));
    setTestCases([...cases]);
  };

  return (
    <>
      <Checkbox
        isChecked={isHidden}
        onChange={(e) => setIsHidden(e.target.checked)}
      >
        Hidden test case
      </Checkbox>
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
            disabled={testCases.length >= 10}
            onClick={() => addToCustomTestCases()}
          >
            Add Test
          </Button>
        </Center>
      </Stack>
      <br />
      <Accordion allowMultiple>
        {testCases
          .sort((a, b) => parseInt(a.id) - parseInt(b.id))
          .map((e: TestCaseInput, i: number) => {
            return (
              <AccordionItem key={e.id}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {e.isHidden && "Hidden"} Test #{i + 1}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box>
                    Input: <Code>{e.stdin}</Code>
                    <br />
                    Expected Output: <Code>{e.expectedOutput}</Code>
                    <br />
                    Hidden?: <Code>{`${e.isHidden}`}</Code>
                    <br />
                    <ButtonGroup float={"right"}>
                      <Button
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
      </Accordion>
    </>
  );
};

export default NewProblemTestCases;
