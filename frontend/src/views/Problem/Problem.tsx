import React from "react";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/layout";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { gql, useQuery } from "@apollo/client";

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
          <Heading>{problem.specification.title}</Heading>
          <Text>
            👍 {problem.likes} 👎 {problem.dislikes}
          </Text>
          <Text>Created by {problem.creator.username}</Text>
          <br />
          <Heading size="md">Description</Heading>
          <Text>{problem.specification.description}</Text>
        </Box>
        <Box className="rightPanel">
          <CodeMirror
            value={problem.specification.initialCode}
            height="1000px"
            extensions={[python()]}
            onChange={(value: any, viewUpdate: any) => {
              console.log("value:", value);
            }}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Problem;
