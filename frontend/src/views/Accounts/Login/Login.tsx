import React from "react";
import { Text, Heading, Stack, Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { BsGithub } from "react-icons/bs";

const REACT_APP_GITHUB_AUTH_URL = process.env
  .REACT_APP_GITHUB_AUTH_URL as string;

const Login = () => {
  return (
    <Stack direction={"row"} justify={"space-evenly"}>
      <Box textAlign={"center"} py={320} w={"100%"}>
        <Heading>Login to Proto</Heading>
        <br />
        <Button
          aria-label={"Login with GitHub"}
          leftIcon={<BsGithub />}
          onClick={() => {
            window.open(REACT_APP_GITHUB_AUTH_URL, "_self");
          }}
        >
          Login with GitHub
        </Button>
      </Box>
      <Box
        w={"100%"}
        py={320}
        backgroundColor={"#393e46"}
        textAlign={"center"}
        color={"#ffffff"}
      >
        <Heading size={"2xl"}>Proto</Heading>
        <Text fontSize={"lg"}>Solve and create programming challenges</Text>
      </Box>
    </Stack>
  );
};

export default Login;
