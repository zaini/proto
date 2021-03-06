import React, { createContext, useEffect, useState } from "react";
import { Box, SimpleGrid } from "@chakra-ui/layout";
import { useParams } from "react-router-dom";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CodeEditor } from "../../components/Problem/CodeEditor/CodeEditor";
import ProblemInformation from "../../components/Problem/ProblemInformation/ProblemInformation";
import { Problem as ProblemType, Submission, User } from "../../gql-types";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

const ProblemContext = createContext<ProblemType>({
  creator: {} as User,
  rating: {} as any,
  id: "0",
  specification: {
    difficulty: "" as any,
    title: "",
    description: "",
    initialCode: {} as any,
    testCases: [],
  },
});

export const GET_PROBLEM = gql`
  query getProblem($problemId: ID!) {
    getProblem(problemId: $problemId) {
      id
      creator {
        username
      }
      rating {
        numberOfRatings
        totalRating
        userRating {
          score
        }
      }
      specification {
        title
        difficulty
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

export const SUBMIT_PROBLEM = gql`
  mutation submitProblem($problemId: ID!, $code: String!, $language: Int!) {
    submitProblem(problemId: $problemId, code: $code, language: $language) {
      id
      userId
      createdAt
      passed
      avgMemory
      avgTime
      language
    }
  }
`;

export const GET_SUBMISSIONS = gql`
  query getSubmissionsForProblem($problemId: ID!) {
    getSubmissionsForProblem(problemId: $problemId) {
      id
      createdAt
      passed
      avgTime
      avgMemory
      language
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
  const [getUserSubmissions] = useLazyQuery(GET_SUBMISSIONS, {
    onCompleted: ({ getSubmissionsForProblem }) => {
      setUserSubmissions(getSubmissionsForProblem);
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

  useEffect(() => {
    getUserSubmissions();
  }, [latestSubmission]);

  const [tabIndex, setTabIndex] = useState(0);

  if (loading) return <Loading />;
  if (error)
    return (
      <Box px={"12.5%"} pt={8}>
        <Error error={error} />
      </Box>
    );
  const problem = data.getProblem;

  return (
    <ProblemContext.Provider
      value={{
        ...problem,
        specification: {
          ...problem.specification,
          initialCode: JSON.parse(problem.specification.initialCode),
        },
      }}
    >
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
