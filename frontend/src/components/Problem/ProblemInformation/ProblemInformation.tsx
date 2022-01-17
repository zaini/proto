import React from "react";
import { Heading, Text } from "@chakra-ui/layout";

const ProblemInformation = ({ problem }: any) => {
  return (
    <>
      <Heading>{problem.specification.title}</Heading>
      <Text>
        👍 {problem.likes} 👎 {problem.dislikes}
      </Text>
      <Text>Created by {problem.creator.username}</Text>
      <br />
      <Heading size="md">Description</Heading>
      <Text>{problem.specification.description}</Text>
    </>
  );
};

export default ProblemInformation;
