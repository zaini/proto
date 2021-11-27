import React, { useContext } from "react";
import { AuthContext } from "../../context/Auth";
import { Box, Heading } from "@chakra-ui/layout";

const Home = () => {
  const { run } = useContext(AuthContext);
  run();
  return (
    <Box>
      <Heading>Home</Heading>
    </Box>
  );
};

export default Home;
