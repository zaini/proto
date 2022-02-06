import React, { createContext, useContext } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Classroom as ClassroomType } from "../../../../gql-types";
import { AuthContext } from "../../../../context/Auth";
import { AccountType } from "../../../../utils";
import TeacherClassroom from "./TeacherClassroom";
import LearnerClassroom from "./LearnerClassroom";

const ClassroomContext = createContext<ClassroomType | any>({ classroom: {} });

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
      users {
        id
        username
      }
      assignments {
        id
        name
        setDate
        dueDate
        submissions {
          id
        }
        problems {
          id
          specification {
            title
          }
        }
      }
    }
  }
`;

const Classroom = () => {
  const { classroomId } = useParams();

  const { accountType }: any = useContext(AuthContext);

  const { loading, error, data } = useQuery(GET_CLASSROOM, {
    variables: {
      classroomId: classroomId,
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
  if (error) return <>Error! ${error.message}</>;

  const classroomData: ClassroomType = data.getClassroom;

  return (
    <ClassroomContext.Provider value={{ classroom: classroomData }}>
      {accountType === AccountType.Teacher ? (
        <TeacherClassroom />
      ) : (
        <LearnerClassroom />
      )}
    </ClassroomContext.Provider>
  );
};

export { Classroom, ClassroomContext };
