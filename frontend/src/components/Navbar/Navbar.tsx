import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ListItem, UnorderedList, Box } from "@chakra-ui/react";
import { AuthContext } from "../../context/Auth";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box>
      <h2>Navbar</h2>
      <h2>proto</h2>
      <UnorderedList>
        <ListItem>
          <Link to="/">Home</Link>
        </ListItem>
        {user === null ? (
          <>
            <ListItem>
              <Link to="/accounts/login">Login</Link>
            </ListItem>
            <ListItem>
              <Link to="/accounts/sign-up">Sign Up</Link>
            </ListItem>
          </>
        ) : (
          <ListItem>
            <Link to="/accounts/log-out">Logout</Link>
          </ListItem>
        )}
      </UnorderedList>
    </Box>
  );
};

export default Navbar;
