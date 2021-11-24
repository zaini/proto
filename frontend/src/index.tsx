import React from "react";
import ReactDOM from "react-dom";
import IndexRouter from "./routes";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <IndexRouter />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
