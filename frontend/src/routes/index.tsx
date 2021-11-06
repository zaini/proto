import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../views/App/App";
import NotFound from "../views/NotFound/NotFound";

const IndexRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<App />} />
                <Route path={"*"} element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default IndexRouter
