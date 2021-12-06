import React from "react";
import {
  Box,
  Container,
  Heading,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";
import ContentBox from "../../ContentBox/ContentBox";

const ProblemCatalogues = () => {
  return (
    <Box>
      <Heading size="lg" mb={12}>
        Problem Catalogues
      </Heading>

      <HStack spacing="auto">
        <ContentBox header="Arrays/Lists" subheader="Easy" text="Common" />
        <ContentBox header="Arrays/Lists" subheader="Easy" text="Common" />
        <ContentBox header="Arrays/Lists" subheader="Easy" text="Common" />
        <ContentBox header="Arrays/Lists" subheader="Easy" text="Common" />
      </HStack>
    </Box>
  );
};

export default ProblemCatalogues;
