import React from "react";
import IndexRouter from "../routes";
import { ChakraProvider } from "@chakra-ui/react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as dotenv from "dotenv";
import { AuthProvider } from "./Auth";
dotenv.config({ path: __dirname + "/.env" });

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
