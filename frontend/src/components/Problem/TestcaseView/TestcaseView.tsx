import React from "react";
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
} from "@chakra-ui/react";

const TestcaseView = ({ customTestData, customTestResults }: any) => {
  return (
    <Tabs>
      <TabList>
        <Tab>All Test Cases</Tab>
        <Tab>Custom Test Cases</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Accordion>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Section 1 title
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Section 2 title
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </TabPanel>
        <TabPanel>
          <p>Custom Test Cases!</p>
          <Accordion>
            {customTestData.map((e: any, i: number) => {
              console.log(customTestResults[i].passed);
              return (
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Custom Test #{i}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    Input: {e.input}
                    <br />
                    Expected Output: {e.expectedOutput}
                    <br />
                    Your Output: {e.expectedOutput}
                    <br />
                    Passed: {customTestResults[i].passed ? "✔" : "❌"}
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TestcaseView;
