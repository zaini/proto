import React, { useState } from "react";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Center,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Classroom } from "../../../../gql-types";
import Error from "../../../../components/Error/Error";
import Loading from "../../../../components/Loading/Loading";

const GET_CLASSROOM = gql`
  query getClassroom($classroomId: ID!) {
    getClassroom(classroomId: $classroomId) {
      id
      name
      password
      creator {
        username
      }
      createdAt
    }
  }
`;

const JOIN_CLASSROOM = gql`
  mutation joinClassroom($classroomId: ID!, $password: String) {
    joinClassroom(classroomId: $classroomId, password: $password) {
      id
    }
  }
`;

const JoinClassroom = () => {
  const { classroomId } = useParams();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, data } = useQuery(GET_CLASSROOM, {
    variables: {
      classroomId: classroomId,
    },
  });

  const [joinClassroom] = useMutation(JOIN_CLASSROOM, {
    onCompleted: ({ joinClassroom }) => {
      window.location.href = `/dashboard/classrooms/${joinClassroom.id}`;
    },
    onError(err) {
      const message =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        err.message;
      window.alert(`Failed to join classroom. \n\n${message}`);
    },
  });

  if (loading) return <Loading />;
  if (error)
    return (
      <Box px={"12.5%"} pt={8}>
        <Error error={error} />
      </Box>
    );

  const classroomData: Classroom = data.getClassroom;

  return (
    <Center px={"12.5%"} py={8}>
      <Stack spacing={4}>
        <Text>
          This is an invitation to join classroom <b>{classroomData.name}</b>{" "}
          created by <b>{classroomData.creator.username}</b> on{" "}
          <b>{new Date(parseInt(classroomData.createdAt)).toLocaleString()}</b>
        </Text>
        {classroomData.password && (
          <InputGroup>
            <InputLeftAddon children="Password" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="(required)"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        )}
        <Button
          onClick={() => {
            joinClassroom({
              variables: {
                classroomId: classroomData.id,
                password: password,
              },
            });
          }}
        >
          Join Classroom
        </Button>
      </Stack>
    </Center>
  );
};

export default JoinClassroom;
