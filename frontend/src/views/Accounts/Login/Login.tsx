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
  const [state, setState] = useState("");
  const navigate = useNavigate();

  const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID as string;
  const redirect_uri = process.env.REACT_APP_GITHUB_REDIRECT_URI as string;

  // https://levelup.gitconnected.com/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc
  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    if (hasCode) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, "", newUrl[0]);

      const code = newUrl[1];

      const requestData = {
        code: code,
      };

      const proxy_url = "http://localhost:5000/authenticate";

      // Use code parameter and other parameters to make POST request to proxy_server
      fetch(proxy_url, {
        method: "POST",
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA RESPONSE:", data);
          const accessToken = data.accessToken;
          // login(accessToken);
          setState(accessToken);
        })
        .catch((error) => {
          console.log("LOGIN FAILED", error);
        });
    }
  }, [user, state]);

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

      <Text>{errors.email && errors.email.message}</Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            placeholder="Email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
        </FormControl>

        <Button isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </form>

      <a
        className="login-link"
        href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
        onClick={() => {
          setState("test");
        }}
      >
        login with github
      </a>
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
