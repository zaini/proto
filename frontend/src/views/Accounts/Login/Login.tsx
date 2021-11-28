import React from "react";
import { Box, Heading } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";

const REACT_APP_GITHUB_AUTH_URL = process.env
  .REACT_APP_GITHUB_AUTH_URL as string;

const Login = () => {
  return (
    <Box>
      <Heading>Login</Heading>

      <Button
        onClick={() => {
          window.open(REACT_APP_GITHUB_AUTH_URL, "_self");
        }}
      >
        Login with GitHub
      </Button>
    </Box>
  );
};

export default Login;
