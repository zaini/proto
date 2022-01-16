import React, { useContext, useEffect } from "react";
import { Box, Heading } from "@chakra-ui/layout";
import { AuthContext } from "../../../context/Auth";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      await logout();
    })();
  }, []);

  return (
    <Box>
      <Heading>Logout</Heading>
    </Box>
  );
};

export default Logout;
