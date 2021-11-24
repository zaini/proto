import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <h2>Navbar</h2>
      <h2>proto</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/accounts/login">Login</Link>
        </li>
        <li>
          <Link to="/accounts/sign-up">Sign Up</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
