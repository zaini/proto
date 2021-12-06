import { Box, Text, Button } from "@chakra-ui/react";
import React from "react";

const ContentBox = ({ header, subheader, text }: any) => {
  return (
    <Box
      p={2}
      w={240}
      h={135}
      backgroundColor={"#EEEEEE"}
      fontWeight={700}
      borderRadius={5}
      boxShadow={"xl"}
    >
      <Text fontSize="xl">{header}</Text>
      <Text fontSize="md" opacity={"50%"}>
        {subheader}
      </Text>
      <Text fontSize="md">{text}</Text>
      <Box textAlign="right">
        <Button fontSize="lg" backgroundColor={"#00ADB5"}>
          GO
        </Button>
      </Box>
    </Box>
  );
};

export default ContentBox;
