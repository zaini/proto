import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/layout";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import CodeEditor from "../../components/Problem/CodeEditor/CodeEditor";
import ProblemInformation from "../../components/Problem/ProblemInformation/ProblemInformation";

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

  if (loading) return <>Loading...</>;
  if (error) return <>Error! ${error.message}</>;

  const problem = data.getProblem;

  return (
    <Box>
      <SimpleGrid columns={2}>
        <Box className="leftPanel" p="4px">
          <ProblemInformation problem={problem} />
        </Box>
        <Box className="rightPanel">
          <CodeEditor problem={problem} />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Problem;
