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

const formatTestData = (
  testCaseInputs: TestCaseInput[],
  testCaseResults: TestCaseResult[]
) => {
  let testData = testCaseResults;
  if (testData.length === 0 || testData === []) {
    testData = testCaseInputs.map((e: TestCaseInput) => {
      return {
        id: e.id,
        testCase: e,
        passed: false,
      };
    });
  }
  return testData;
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
          You must pass all these test cases before submitting.
          <br />
          Hidden testcases mean you cannot see the input or expected output.
          <ProblemTestCaseTab />
        </TabPanel>
        <TabPanel>
          You can create and run up to 10 of your own test cases here.
          <CustomTestCaseTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TestCaseView;
