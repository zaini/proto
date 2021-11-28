import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Box, Heading, Text } from "@chakra-ui/layout";
import gql from "graphql-tag";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../context/Auth";
import { useNavigate } from "react-router";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const [loginMutation] = useMutation(LOGIN, {
    onError: (err) => {
      setError("email", {
        message: `${err}`,
      });
    },
    onCompleted: (res) => {
      const accessToken = res.login.accessToken;
      login(accessToken);
      navigate("/", { replace: true });
    },
  });

  const onSubmit = async (data: any) => {
    loginMutation({ variables: data });
  };

  return (
    <Box>
      <Heading>Login</Heading>

      <Button
        onClick={() => {
          window.open("http://localhost:5000/auth/github/", "_self");
        }}
      >
        Login with GitHub
      </Button>
    </Box>
  );
};

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

export default Login;
