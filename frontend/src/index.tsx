import React from "react";
import ReactDOM from "react-dom";
import App from "./context/ApolloProvider";
import "./styles/global.css";
import "./styles/Typist.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
