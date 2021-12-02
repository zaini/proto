import React, { useContext } from "react";
import { Box, Heading } from "@chakra-ui/layout";
import { AuthContext } from "../../context/Auth";

const Home = () => {
  const { user } = useContext(AuthContext);

  console.log("home1", user);
  return (
    <Box>
      <Heading>Home</Heading>
    </Box>
  );
};

export default Home;
