import React from "react";
import { Box, Heading, HStack } from "@chakra-ui/react";
import ContentBox from "../../ContentBox/ContentBox";

const AssignmentsPreview = () => {
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