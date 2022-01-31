import React, { useContext } from "react";
import { Classroom, User } from "../../../../../gql-types";
import { Button, ButtonGroup, Center, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import CustomTable from "../../../../../components/CustomTable/CustomTable";
import CopyLink from "../../../../../components/CopyLink/CopyLink";
import { ClassroomContext } from "../Classroom";

const ClassroomStudentsPanel = () => {
  const { classroom: x } = useContext(ClassroomContext);
  const classroom: Classroom = x;

  return (
    <>
      {classroom.users && classroom.users.length > 0 ? (
        <CustomTable
          columns={[
            {
              Header: "Username",
              accessor: "username",
            },
            {
              Header: "Options",
              accessor: "options",
            },
          ]}
          data={classroom.users.map((student: User, i: number) => {
            return {
              username: student.username,
              options: (
                <ButtonGroup>
                  <Link to={`/users/${student.id}`}>
                    <Button colorScheme={"blue"}>View</Button>
                  </Link>
                  <Link to={`/users/${student.id}/submissions`}>
                    <Button colorScheme={"blue"}>Submissions</Button>
                  </Link>
                  <Button colorScheme={"red"}>Remove</Button>
                </ButtonGroup>
              ),
            };
          })}
        />
      ) : (
        <Center mb={8}>
          <Stack spacing={4}>
            <Text>This classroom does not have any students!</Text>
            <CopyLink
              link={
                window.location.origin +
                `/dashboard/classrooms/join/${classroom.id}`
              }
              text={"Copy Invite Link"}
            />
          </Stack>
        </Center>
      )}
    </>
  );
};

export default ClassroomStudentsPanel;
