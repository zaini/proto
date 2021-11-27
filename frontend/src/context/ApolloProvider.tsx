import React from "react";
import IndexRouter from "../routes";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import * as dotenv from "dotenv";
import { AuthProvider } from "./Auth";
dotenv.config({ path: __dirname + "/.env" });

const client = new ApolloClient({
  uri: process.env.REACT_APP_BACKEND_URL,
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ChakraProvider>
          <IndexRouter />
        </ChakraProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
