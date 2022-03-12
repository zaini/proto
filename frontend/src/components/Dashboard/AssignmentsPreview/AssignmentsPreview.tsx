import React from "react";
import { Box, Heading, HStack, Center, Spinner } from "@chakra-ui/react";
import ContentBox from "../../ContentBox/ContentBox";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

const GET_ASSIGNMENTS = gql`
  query getAssignments {
    getAssignments {
      dueDate
      createdAt
      name
      classroom {
        name
      }
    }
  }
`;

const AssignmentsPreview = () => {
  const { loading, error, data } = useQuery(GET_ASSIGNMENTS);

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
  if (error) return <>Error! {error.message}</>;

  const assignments = data.getAssignments;

  console.log(assignments);

  return (
    <Box>
      <Heading size="lg" mb={12}>
        You have 2 assignments!
      </Heading>

      <HStack spacing="auto">
        <ContentBox header="Two Sum" subheader="Easy" text="Due in 3 hours" />
        <ContentBox header="Two Sum" subheader="Easy" text="Due in 3 hours" />
        <ContentBox header="Two Sum" subheader="Easy" text="Due in 3 hours" />
        <ContentBox header="Two Sum" subheader="Easy" text="Due in 3 hours" />
        <ContentBox header="Two Sum" subheader="Easy" text="Due in 3 hours" />
      </HStack>
    </Box>
  );
};

export default AssignmentsPreview;
