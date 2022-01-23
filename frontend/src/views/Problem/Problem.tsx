import React, { createContext, useEffect, useState } from "react";
import { Box, SimpleGrid } from "@chakra-ui/layout";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { CodeEditor } from "../../components/Problem/CodeEditor/CodeEditor";
import ProblemInformation from "../../components/Problem/ProblemInformation/ProblemInformation";
import { Spinner, Center } from "@chakra-ui/react";
import { Problem as ProblemType, Submission, User } from "../../gql-types";

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

const SUBMIT_PROBLEM = gql`
  mutation submitProblem($problemId: ID!, $code: String, $language: Int) {
    submitProblem(problemId: $problemId, code: $code, language: $language) {
      submissionResults {
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
      createdAt
    }
  }
`;

const GET_SUBMISSIONS = gql`
  query GetUserSubmissionsForProblem($problemId: ID!) {
    getUserSubmissionsForProblem(problemId: $problemId) {
      submissionResults {
        stdout
        id
        testCase {
          id
          stdin
          expectedOutput
          isHidden
        }
        passed
        stderr
        time
        memory
      }
      userId
      problemId
      createdAt
    }
  }
`;

const Problem = () => {
  const params = useParams();
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(
    null
  );
  const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);

  const { loading, error, data } = useQuery(GET_PROBLEM, {
    variables: {
      problemId: params.problemId,
    },
  });

  // Use query is automatically called when we had a new submissions since the state changes
  // Could add caching to this
  const {
    loading: submissionsLoading,
    error: submissionsError,
    data: submissionsData,
  } = useQuery(GET_SUBMISSIONS, {
    onCompleted: ({ getUserSubmissionsForProblem }) => {
      setUserSubmissions(getUserSubmissionsForProblem);
    },
    variables: {
      problemId: params.problemId,
    },
  });

  const [
    submitProblem,
    {
      loading: submissionLoading,
      error: submissionError,
      data: submissionData,
    },
  ] = useMutation(SUBMIT_PROBLEM, {
    onCompleted: ({ submitProblem }) => {
      setLatestSubmission(submitProblem);
    },
  });

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
          <ProblemInformation
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            latestSubmission={latestSubmission}
            userSubmissions={userSubmissions}
          />
        </Box>
        <Box className="rightPanel">
          <CodeEditor
            submitProblem={submitProblem}
            openSubmissionsTab={() => setTabIndex(1)}
            loading={submissionLoading}
          />
        </Box>
      </SimpleGrid>
    </ProblemContext.Provider>
  );
};

export { Problem, ProblemContext };
