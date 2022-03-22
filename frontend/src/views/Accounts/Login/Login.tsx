import React from "react";
import { Text, Heading, Stack, Box, Center } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { BsGithub } from "react-icons/bs";

const REACT_APP_GITHUB_AUTH_URL = process.env
  .REACT_APP_GITHUB_AUTH_URL as string;

const Login = () => {
  return (
    <Stack
      direction={"row"}
      justify={"space-evenly"}
      height={"calc(100vh - 150px)"}
    >
      <Box textAlign={"center"} w={"100%"} my={"auto"}>
        <Heading>Login to Proto</Heading>
        <br />
        <Button
          aria-label={"Login with GitHub"}
          colorScheme={"blue"}
          leftIcon={<BsGithub />}
          onClick={() => {
            window.open(REACT_APP_GITHUB_AUTH_URL, "_self");
          }}
        >
          Login with GitHub
        </Button>
      </Box>
      <Center
        w={"100%"}
        backgroundColor={"#393e46"}
        textAlign={"center"}
        color={"#ffffff"}
      >
        <Box>
          <Heading size={"2xl"}>Proto</Heading>
          <Text fontSize={"lg"}>Solve and create programming challenges</Text>
        </Box>
      </Center>
    </Stack>
  );
};

export default Login;
