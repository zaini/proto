import React, { useContext } from "react";
import { Box, Text, Button, useColorMode } from "@chakra-ui/react";
import { AccountType } from "../../utils";
import { AuthContext } from "../../context/Auth";

const Footer = () => {
  const { setAccountType, accountType } = useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bgColor="#393E46" color="#FFFFFF">
      @@@fake footer, used for testing@@@
      <Text>Account Type: {accountType}</Text>
      <Button
        color="#393E46"
        onClick={() => setAccountType(AccountType.Teacher)}
      >
        Teacher
      </Button>
      <Button
        color="#393E46"
        onClick={() => setAccountType(AccountType.Learner)}
      >
        Learner
      </Button>
      <Button color="#393E46" onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
    </Box>
  );
};

export default Footer;
