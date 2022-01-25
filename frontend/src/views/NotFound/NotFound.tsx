import React from "react";
import { Heading, Text, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Stack textAlign={"center"} my={8}>
      <Heading>Page Not Found</Heading>
      <Text>
        Maybe try{" "}
        <u>
          <b>
            <Link to="/accounts/login">logging in</Link>
          </b>
        </u>{" "}
        and then trying that page again?
      </Text>
    </Stack>
  );
};

export default NotFound;
