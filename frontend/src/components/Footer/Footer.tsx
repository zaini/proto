import React, { useContext } from "react";
import { Box, Text, HStack, Link } from "@chakra-ui/react";
import { AccountType } from "../../utils";
import { AuthContext } from "../../context/Auth";

const Footer = () => {
  const { accountType } = useContext(AuthContext);

  return (
    <Box bgColor="#393E46" color="#FFFFFF" py={50} height="150px">
      <Text textAlign={"center"}>
        You are using Proto in{" "}
        {accountType === AccountType.Teacher ? "teacher" : "student"} mode.
      </Text>
      <Box whiteSpace={"nowrap"} textAlign={"center"}>
        Copyright &copy; 2022 Proto{" | "}
        <Link href="mailto:alimzaini@outlook.com">Contact</Link>
        {" | "}
        <Link href="/support">Support</Link>
      </Box>
    </Box>
  );
};

export default Footer;
