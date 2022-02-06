import React from "react";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { User } from "../../gql-types";
import { Center, Spinner } from "@chakra-ui/react";

const GET_USER = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      problems {
        id
        specification {
          title
        }
      }
      classrooms {
        id
      }
      UsersOnClassrooms {
        id
        name
      }
      createdAt
    }
  }
`;

const Profile = () => {
  const { userId } = useParams();

  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userId: userId,
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
  if (error) return <>Could not find user. {error.message}</>;

  const profile: User = data.getUser;

  return (
    <div>
      Profile {profile.id} {profile.username}
      <br />
      {profile.username} owns{" "}
      {profile.classrooms ? profile.classrooms.length : 0} classrooms.
      <br />
      {profile.username} is a student in{" "}
      {profile.UsersOnClassrooms ? profile.UsersOnClassrooms.length : 0}{" "}
      classrooms.
    </div>
  );
};

export default Profile;
