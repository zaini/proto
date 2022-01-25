import React, { useState } from "react";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import {
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

  if (loading)
    return (
      <Center h="1000px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  // TODO have an actual error page and log this
  if (error) return <>Could not find the classroom for this invite link.</>;

  const classroomData: Classroom = data.getClassroom;

  return (
    <Center my={8}>
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
