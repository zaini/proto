import React from "react";
import {
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Code,
} from "@chakra-ui/react";
import { TestCaseInput, TestCaseResult } from "../../../gql-types";
import ProblemTestCaseTab from "./ProblemTestCaseTab/ProblemTestCaseTab";
import CustomTestCaseTab from "./CustomTestCaseTab/CustomTestCaseTab";

type TestCaseViewProps = {
  tabIndex: any;
  setTabIndex: any;
};

const TestCaseView = ({ tabIndex, setTabIndex }: TestCaseViewProps) => {
  return (
    <Tabs
      index={tabIndex}
      onChange={(index) => {
        setTabIndex(index);
      }}
    >
      <TabList>
        <Tab>All Test Cases</Tab>
        <Tab>Custom Test Cases</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProblemTestCaseTab />
        </TabPanel>
        <TabPanel>
          <CustomTestCaseTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TestCaseView;
