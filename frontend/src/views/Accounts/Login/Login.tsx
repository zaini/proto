import React from "react";
import { Box, Heading } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";

const Login = () => {
  return (
    <Box>
      <Heading>Login</Heading>

      <Button
        onClick={() => {
          window.open("http://localhost:5000/auth/github/", "_self");
        }}
      >
        Login with GitHub
      </Button>
    </Box>
  );
};

export default Login;
