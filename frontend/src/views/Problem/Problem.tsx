import React, { createContext } from "react";
import { Box, SimpleGrid } from "@chakra-ui/layout";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
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
      }
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
  if (error) return <>Error! ${error.message}</>;

  return (
    <ProblemContext.Provider value={data.getProblem}>
      <SimpleGrid columns={2}>
        <Box className="leftPanel" p="4px">
          <ProblemInformation />
        </Box>
        <Box className="rightPanel">
          <CodeEditor />
        </Box>
      </SimpleGrid>
    </ProblemContext.Provider>
  );
};

export { Problem, ProblemContext };
