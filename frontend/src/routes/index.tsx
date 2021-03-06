import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import Login from "../views/Accounts/Login/Login";
import Logout from "../views/Accounts/Logout/Logout";
import Settings from "../views/Profile/Settings/Settings";
import { Classroom } from "../views/Dashboard/Classrooms/Classroom/Classroom";
import Classrooms from "../views/Dashboard/Classrooms/Classrooms";
import JoinClassroom from "../views/Dashboard/Classrooms/JoinClassroom/JoinClassroom";
import Home from "../views/Home/Home";
import NotFound from "../views/NotFound/NotFound";
import { Problem } from "../views/Problem/Problem";
import Profile from "../views/Profile/Profile";
import { Assignment } from "../views/Dashboard/Classrooms/Classroom/Assignment/Assignment";
import NewProblem from "../views/Problem/NewProblem/NewProblem";
import DashboardHome from "../views/Dashboard/DashboardHome/DashboardHome";

const IndexRouter = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path={"/"} element={<Home />} />
        <Route path={"/accounts/login"} element={<Login />} />
        <Route path={"/accounts/log-out"} element={<Logout />} />

        {/* private routes */}
        {user && (
          <>
            <Route path={"/dashboard"} element={<DashboardHome />} />
            <Route path={"/dashboard/classrooms"} element={<Classrooms />} />
            <Route
              path={"/dashboard/classrooms/join/:classroomId"}
              element={<JoinClassroom />}
            />
            <Route
              path={"/dashboard/classrooms/:classroomId"}
              element={<Classroom />}
            />
            <Route
              path={"/dashboard/classrooms/:classroomId/assignments"}
              element={<Classroom />}
            />
            <Route
              path={
                "/dashboard/classrooms/:classroomId/assignments/:assignmentId"
              }
              element={<Assignment />}
            />
            <Route path={"/problems/new"} element={<NewProblem />} />
            <Route path={"/problems/:problemId"} element={<Problem />} />
            <Route path={"/profile/settings"} element={<Settings />} />
            <Route path={"/profile/:userId"} element={<Profile />} />
          </>
        )}

        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default IndexRouter;
