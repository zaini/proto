import React from "react";
import { useMutation } from "@apollo/client";
import { Box, Heading, Text } from "@chakra-ui/layout";
import gql from "graphql-tag";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const [login] = useMutation(LOGIN, {
    onError: (err) => {
      setError("email", {
        message: `${err}`,
      });
    },
    onCompleted: (data) => {
      console.log(data);
    },
  });

  const onSubmit = async (data: any) => {
    login({ variables: data });
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
