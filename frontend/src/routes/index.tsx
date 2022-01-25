import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../views/Accounts/Login/Login";
import Logout from "../views/Accounts/Logout/Logout";
import { Classroom } from "../views/Dashboard/Classrooms/Classroom/Classroom";
import Classrooms from "../views/Dashboard/Classrooms/Classrooms";
import JoinClassroom from "../views/Dashboard/Classrooms/JoinClassroom/JoinClassroom";
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
        <Route path={"/dashboard/classrooms"} element={<Classrooms />} />
        <Route
          path={"/dashboard/classrooms/join/:classroomId"}
          element={<JoinClassroom />}
        />
        <Route
          path={"/dashboard/classrooms/:classroomId"}
          element={<Classroom />}
        />
        <Route path={"/problems/:problemId"} element={<Problem />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default IndexRouter;
