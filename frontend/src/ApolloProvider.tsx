import React from "react";
import IndexRouter from "./routes";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const client = new ApolloClient({
  uri: process.env.REACT_APP_BACKEND_URL,
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <IndexRouter />
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
