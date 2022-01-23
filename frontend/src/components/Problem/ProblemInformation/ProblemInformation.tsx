import React, { useContext, useState } from "react";
import { Heading } from "@chakra-ui/layout";
import { ProblemContext } from "../../../views/Problem/Problem";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Submissions from "./Submissions/Submissions";

const ProblemInformation = () => {
  const problem = useContext(ProblemContext);

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Heading>{problem.specification.title}</Heading>

      <Tabs
        index={tabIndex}
        onChange={(index) => {
          setTabIndex(index);
        }}
      >
        <TabList>
          <Tab>Description</Tab>
          <Tab>Submissions</Tab>
          <Tab>Leaderboard</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProblemDescription />
          </TabPanel>
          <TabPanel>
            <Submissions />
          </TabPanel>
          <TabPanel>TODO maybe make a leaderboard?</TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ProblemInformation;
