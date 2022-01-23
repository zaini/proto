import React, { useContext } from "react";
import { Heading, Text, Code } from "@chakra-ui/layout";
import { ProblemContext } from "../../../../views/Problem/Problem";

const ProblemDescription = () => {
  const problem = useContext(ProblemContext);

  return (
    <>
      <Text>
        <Code>👍 {problem.likes}</Code> <Code>👎 {problem.dislikes}</Code>{" "}
        <Code>Created by {problem.creator.username}</Code>
      </Text>
      <br />
      <Text>{problem.specification.description}</Text>

      {/* TODO do this properly lol */}
      <Heading size={"md"} mb={2} mt={4}>
        Example 1
      </Heading>
      <Code>
        Input: 1 2
        <br />
        Output: 3
      </Code>

      <Heading size={"md"} mb={2} mt={4}>
        Example 2
      </Heading>
      <Code>
        Input: 5 7
        <br />
        Output: 12
      </Code>
    </>
  );
};

export default ProblemDescription;
