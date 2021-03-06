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
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";

export const GET_CLASSROOMS = gql`
  query getLearnerClassrooms {
    getLearnerClassrooms {
      id
      name
    }
  }
`;

const LearnerClassrooms = () => {
  const { loading, error, data } = useQuery(GET_CLASSROOMS);

  if (loading) return <Loading />;
  if (error)
    return (
      <Box px={"12.5%"} pt={8}>
        <Error error={error} />
      </Box>
    );

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
