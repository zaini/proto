import React, { useContext, useEffect } from "react";
import {
  Box,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  useBreakpointValue,
  ButtonGroup,
} from "@chakra-ui/react";
import Typist from "react-typist";
import { AuthContext } from "../../context/Auth";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box mx={"4rem"} my={"6rem"}>
      <HStack justify={"space-evenly"}>
        <Box maxW={700}>
          <Heading size={"2xl"}>Proto</Heading>
          <Heading>
            <Typist
              cursor={{
                show: true,
                blink: true,
                element: "|",
                hideWhenDone: false,
              }}
            >
              Solve, create and share programming challenges
            </Typist>
          </Heading>
          <br />
          <HStack spacing={16}>
            <Box>
              <Heading size={"md"}>For Learners</Heading>
              <Text>
                Search through many problems to practice programming questions
                available in various languages, including Python, Java and
                JavaScript. Also create your own problems and share them with
                others to solve.
              </Text>
            </Box>
            <Box>
              <Heading size={"md"}>For Teachers</Heading>
              <Text>
                Create classrooms, invite students, set and manage assignments.
                View and export statistics to keep track of how your class is
                performing.
              </Text>
            </Box>
          </HStack>
          <br />

          {user ? (
            <ButtonGroup>
              <Button
                colorScheme={"blue"}
                size={"lg"}
                aria-label={"Go to dashboard"}
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                Dashboard
              </Button>
              <Button
                colorScheme={"blue"}
                size={"lg"}
                aria-label={"Go to classrooms"}
                onClick={() => {
                  window.location.href = "/dashboard/classrooms";
                }}
              >
                Classrooms
              </Button>
            </ButtonGroup>
          ) : (
            <Button
              colorScheme={"blue"}
              size={"lg"}
              aria-label={"Login with GitHub"}
              onClick={() => {
                window.open("/accounts/login", "_self");
              }}
            >
              Get Started Now
            </Button>
          )}
        </Box>

        {useBreakpointValue(
          {
            base: <Image w={"50%"} src={"/images/problem_screenshot.png"} />,
            md: null,
          },
          "1300px"
        )}
      </HStack>
    </Box>
  );
};

export default Home;
