import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Classroom } from "../../../gql-types";
import CopyLink from "../../../components/CopyLink/CopyLink";

const GET_CLASSROOMS = gql`
  query getClassrooms {
    getLearnerClassrooms {
      id
      name
    }
  }
`;

const LearnerClassrooms = () => {
  const { loading, error, data } = useQuery(GET_CLASSROOMS);

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
  if (error) return <>Error! ${error.message}</>;

  const classrooms: Classroom[] = data.getLearnerClassrooms;

  return (
    <Box px={"12.5%"} pt={8}>
      <Heading>Classrooms</Heading>

      <br />

      <Box>
        {classrooms && classrooms.length > 0 ? (
          <CustomTable
            columns={[
              {
                Header: "Classroom Name",
                accessor: "classroomName",
              },
              {
                Header: "Options",
                accessor: "options",
              },
            ]}
            data={classrooms.map((classroom: Classroom) => {
              return {
                classroomName: `#${classroom.id} ${classroom.name}`,
                options: (
                  <ButtonGroup>
                    <Link to={`/dashboard/classrooms/${classroom.id}`}>
                      <Button colorScheme={"blue"}>View</Button>
                    </Link>
                    <CopyLink
                      link={
                        window.location.origin +
                        `/dashboard/classrooms/join/${classroom.id}`
                      }
                      text={"Copy Invite Link"}
                      colorScheme="blue"
                    />
                  </ButtonGroup>
                ),
              };
            })}
          />
        ) : (
          <Center mb={8} textAlign={"center"}>
            You are not in any classrooms!
            <br /> <br />
            You will need an invite link to join a classroom.
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default LearnerClassrooms;
