import React, { createContext, useContext } from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Classroom as ClassroomType } from "../../../../gql-types";
import { AuthContext } from "../../../../context/Auth";
import { AccountType } from "../../../../utils";
import TeacherClassroom from "./TeacherClassroom";
import LearnerClassroom from "./LearnerClassroom";
import Loading from "../../../../components/Loading/Loading";
import Error from "../../../../components/Error/Error";

const ClassroomContext = createContext<ClassroomType | any>({ classroom: {} });

const GET_CLASSROOM = gql`
  query getClassroom($classroomId: ID!) {
    getClassroom(classroomId: $classroomId) {
      id
      name
      createdAt
      password
      users {
        username
        id
      }
      creator {
        username
        id
      }
      assignments {
        id
        name
        createdAt
        setDate
        dueDate
        problems {
          id
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

  if (loading) return <Loading />;
  if (error)
    return (
      <Box px={"12.5%"} pt={8}>
        <Error error={error} />
      </Box>
    );

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
