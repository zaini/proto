import React, { useContext } from "react";
import { Heading, Text, Code } from "@chakra-ui/layout";
import { ProblemContext } from "../../../views/Problem/Problem";

const ProblemInformation = () => {
  const problem = useContext(ProblemContext);

  return (
    <>
      <Heading>{problem.specification.title}</Heading>
      <Text>
        <Code>👍 {problem.likes}</Code> <Code>👎 {problem.dislikes}</Code>
      </Text>
      Created by <Code>{problem.creator.username}</Code>
      <br />
      <Heading size="md">Description</Heading>
      <Text>{problem.specification.description}</Text>
    </>
  );
};

export default ProblemInformation;
