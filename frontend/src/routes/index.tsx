import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../views/Accounts/Login";
import Home from "../views/Home/Home";
import NotFound from "../views/NotFound/NotFound";

const IndexRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/accounts/login"} element={<Login />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default IndexRouter;
