import React from "react";
import { ApolloError } from "@apollo/client";
import { Alert, AlertIcon, Box, Textarea } from "@chakra-ui/react";

type Props = {
  error: ApolloError;
};

const Error = ({ error }: Props) => {
  return (
    <>
      <Alert status="error" borderRadius="50px">
        <AlertIcon />
        An error has occured!
      </Alert>
      <br />
      <b>Details</b>
      <br />
      <br />
      <Textarea>
        {(error.graphQLErrors &&
          error.graphQLErrors[0] &&
          error.graphQLErrors[0].message) ||
          error.message}
      </Textarea>
    </>
  );
};

export default Error;
