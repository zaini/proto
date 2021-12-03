import React from "react";
import IndexRouter from "../routes";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/roboto-mono";
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

const REACT_APP_GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL;

const httpLink = createHttpLink({
  uri: REACT_APP_GRAPHQL_URL,
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
  uri: REACT_APP_GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const theme = extendTheme({
  fonts: {
    body: "Roboto Mono",
    heading: "Roboto Mono",
  },
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <IndexRouter />
        </ChakraProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;