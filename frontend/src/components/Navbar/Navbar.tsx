import React from "react";
import { Link } from "react-router-dom";
import { ListItem, UnorderedList, Box } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box>
      <h2>Navbar</h2>
      <h2>proto</h2>
      <UnorderedList>
        <ListItem>
          <Link to="/">Home</Link>
        </ListItem>
        <ListItem>
          <Link to="/accounts/login">Login</Link>
        </ListItem>
        <ListItem>
          <Link to="/accounts/sign-up">Sign Up</Link>
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

export default Navbar;
