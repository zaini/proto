import React, { useContext, useState } from "react";
import { Heading } from "@chakra-ui/layout";
import { ProblemContext } from "../../../views/Problem/Problem";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Submissions from "./Submissions/Submissions";
import { Submission } from "../../../gql-types";
import Leaderboard from "./Leaderboard/Leaderboard";

type ProblemInformationProps = {
  tabIndex: number;
  setTabIndex: any;
  userSubmissions: Submission[];
  latestSubmission: Submission | null;
};

const ProblemInformation = ({
  tabIndex,
  setTabIndex,
  userSubmissions,
  latestSubmission,
}: ProblemInformationProps) => {
  const problem = useContext(ProblemContext);

  return (
    <>
      <Heading p={4}>{problem.specification.title}</Heading>
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
            <Submissions
              userSubmissions={userSubmissions}
              latestSubmission={latestSubmission}
            />
          </TabPanel>
          <TabPanel>
            <Leaderboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ProblemInformation;
