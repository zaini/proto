import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth";

// If loggedIn is true, then this route requires user to be logged in. Otherwise, they must be logged out.
// If a route is not protected then no checks are done. Everyone can view the page.
const ProtectedRoute = ({ children, mustBeLoggedIn }: any) => {
  const { user } = useContext(AuthContext);
  if (user) {
    if (mustBeLoggedIn) {
      return children;
    } else {
      return <Navigate replace to="/dashboard" />;
    }
  } else {
    if (mustBeLoggedIn) {
      return <Navigate replace to="/accounts/login" />;
    } else {
      return children;
    }
  }
};

export default ProtectedRoute;
