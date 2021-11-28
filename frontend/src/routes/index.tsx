import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Login from "../views/Accounts/Login/Login";
import Logout from "../views/Accounts/Logout/Logout";
import Home from "../views/Home/Home";
import NotFound from "../views/NotFound/NotFound";

const IndexRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/accounts/login"} element={<Login />} />
        <Route path={"/accounts/log-out"} element={<Logout />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default IndexRouter;
