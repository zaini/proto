import React, { createContext, useContext, useState } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Assignment as AssignmentType } from "../../../../../gql-types";
import { AuthContext } from "../../../../../context/Auth";
import TeacherAssignment from "./TeacherAssignment";
import LearnerAssignment from "./LearnerAssignment";

const AssignmentContext = createContext<AssignmentType | any>({
  assignment: {},
});

const GET_ASSIGNMENT = gql`
  query getAssignment($assignmentId: ID!, $classroomId: ID!) {
    getAssignment(assignmentId: $assignmentId, classroomId: $classroomId) {
      id
      name
      setDate
      dueDate
      classroom {
        id
        name
        creator {
          id
        }
      }
      problems {
        id
        specification {
          title
        }
      }
    }
  }
`;

const Assignment = () => {
  const { classroomId, assignmentId } = useParams();

  const { user }: any = useContext(AuthContext);

  const { loading, error, data } = useQuery(GET_ASSIGNMENT, {
    variables: {
      assignmentId: assignmentId,
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

  const assignmentData: AssignmentType = data.getAssignment;

  // If you created the classroom you can only view it as a teacher, your selected account type doesn't matter.
  return (
    <>
      <AssignmentContext.Provider value={{ assignment: assignmentData }}>
        {parseInt(assignmentData.classroom.creator.id) === parseInt(user.id) ? (
          <TeacherAssignment />
        ) : (
          <LearnerAssignment />
        )}
      </AssignmentContext.Provider>
    </>
  );
};

export { Assignment, AssignmentContext };
