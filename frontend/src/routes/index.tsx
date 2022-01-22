import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../views/Accounts/Login/Login";
import Logout from "../views/Accounts/Logout/Logout";
import DashboardHome from "../views/Dashboard/Home/Home";
import Home from "../views/Home/Home";
import NotFound from "../views/NotFound/NotFound";
import { Problem } from "../views/Problem/Problem";
// import ProtectedRoute from "./utils/ProtectedRoute";

const IndexRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/accounts/login"} element={<Login />} />
        <Route path={"/accounts/log-out"} element={<Logout />} />
        <Route path={"/dashboard/"} element={<DashboardHome />} />
        <Route path={"/problems/:problemId"} element={<Problem />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default IndexRouter;
