import React, { createContext, useState } from "react";
import { Box, SimpleGrid } from "@chakra-ui/layout";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { CodeEditor } from "../../components/Problem/CodeEditor/CodeEditor";
import ProblemInformation from "../../components/Problem/ProblemInformation/ProblemInformation";
import { Spinner, Center } from "@chakra-ui/react";
import { Problem as ProblemType, User } from "../../gql-types";

const ProblemContext = createContext<ProblemType>({
  creator: {} as User,
  dislikes: 0,
  id: "0",
  likes: 0,
  specification: {
    title: "",
    description: "",
    initialCode: "",
    testCases: [],
  },
});

const GET_PROBLEM = gql`
  query getProblem($problemId: ID!) {
    getProblem(problemId: $problemId) {
      id
      creator {
        username
      }
      likes
      dislikes
      specification {
        title
        description
        initialCode
        testCases {
          id
          stdin
          expectedOutput
          isHidden
        }
      }
    }
  }
`;

const SUBMIT_TESTS = gql`
  mutation submitTests(
    $problemId: ID!
    $code: String
    $language: Int
    $testCases: [TestCaseInput!]
    $submissionType: SubmissionType
  ) {
    submitTests(
      problemId: $problemId
      code: $code
      language: $language
      testCases: $testCases
      submissionType: $submissionType
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
      submissionType
    }
  }
`;

const Problem = () => {
  const params = useParams();
  const { loading, error, data } = useQuery(GET_PROBLEM, {
    variables: {
      problemId: params.problemId,
    },
  });

  const [submitTests, { loading: submissionLoading }] = useMutation(
    SUBMIT_TESTS,
    {
      onCompleted: ({ submitTests }) => {
        console.log("res:", submitTests);
      },
    }
  );

  const [tabIndex, setTabIndex] = useState(0);

  if (loading)
    return (
      <Center h="1000px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  // TODO have an actual error page and log this
  if (error) return <>Error! ${error.message}</>;

  return (
    <ProblemContext.Provider value={data.getProblem}>
      <SimpleGrid columns={2}>
        <Box className="leftPanel" p="4px">
          <ProblemInformation tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </Box>
        <Box className="rightPanel">
          <CodeEditor
            submitTests={submitTests}
            openSubmissionsTab={() => setTabIndex(1)}
            loading={submissionLoading}
          />
        </Box>
      </SimpleGrid>
    </ProblemContext.Provider>
  );
};

export { Problem, ProblemContext };
