import React, { useContext, useEffect } from "react";
import { Box, Heading } from "@chakra-ui/layout";
import { AuthContext } from "../../../context/Auth";
import { useNavigate } from "react-router";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await logout();
      navigate("/", { replace: true });
    })();
  }, []);

  return (
    <Box>
      <Heading>Logout</Heading>
    </Box>
  );
};

export default Logout;
