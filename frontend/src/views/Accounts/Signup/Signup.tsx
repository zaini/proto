import React from "react";
import { useMutation } from "@apollo/client";
import { Box, Heading, Text } from "@chakra-ui/layout";
import gql from "graphql-tag";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const Signup = () => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const [signUp, { loading, error, data }] = useMutation(SIGN_UP, {
    onError: (err) => {
      setError("email", {
        message: `${err}`,
      });
    },
  });

  const onSubmit = async (data: any) => {
    signUp({ variables: data });
  };

  return (
    <Box>
      <Heading>Sign Up</Heading>

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
            {...register("password", { required: true, min: 4 })}
          />
        </FormControl>

        <FormControl id="passwordConfirmation" isRequired>
          <FormLabel>Repeat Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            {...register("passwordConfirmation", { required: true, min: 4 })}
          />
        </FormControl>

        <Button isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

const SIGN_UP = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    signup(
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      id
      email
    }
  }
`;

export default Signup;
