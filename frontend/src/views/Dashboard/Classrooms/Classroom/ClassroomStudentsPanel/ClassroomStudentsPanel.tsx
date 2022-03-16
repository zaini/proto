import React, { useContext, useState } from "react";
import { Classroom, User } from "../../../../../gql-types";
import {
  Button,
  ButtonGroup,
  Center,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import CustomTable from "../../../../../components/CustomTable/CustomTable";
import CopyLink from "../../../../../components/CopyLink/CopyLink";
import { ClassroomContext } from "../Classroom";
import RemoveStudent from "../RemoveStudent/RemoveStudent";

const ClassroomStudentsPanel = () => {
  const { classroom: x } = useContext(ClassroomContext);
  const classroom: Classroom = x;

  const [studentToView, setStudentToView] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RemoveStudent
        isOpen={isOpen}
        onClose={onClose}
        student={studentToView}
        classroom={classroom}
      />

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
                  <Link to={`/profile/${student.id}`}>
                    <Button colorScheme={"blue"}>View</Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setStudentToView(student);
                      onOpen();
                    }}
                    colorScheme={"red"}
                  >
                    Remove
                  </Button>
                </ButtonGroup>
              ),
            };
          })}
        />
      ) : (
        <Center>
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
