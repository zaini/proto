import React, { useContext } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { AuthContext } from "../../../context/Auth";
import { Button, Text } from "@chakra-ui/react";
import { AccountType } from "../../../utils";

const DashboardHome = () => {
  const { setAccountType, accountType } = useContext(AuthContext);
  return (
    <Box>
      <Heading>Dashboard Home</Heading>

      <Text>Account Type: {accountType}</Text>

      <Button onClick={() => setAccountType(AccountType.Teacher)}>
        Teacher
      </Button>
      <Button onClick={() => setAccountType(AccountType.Learner)}>
        Learner
      </Button>
    </Box>
  );
};

export default DashboardHome;
