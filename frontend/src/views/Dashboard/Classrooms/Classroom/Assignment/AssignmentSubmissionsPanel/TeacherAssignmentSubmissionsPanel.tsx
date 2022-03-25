import React, { useContext, useEffect, useState } from "react";
import {
  Assignment,
  UserAssignmentSubmissionDataRow,
} from "../../../../../../gql-types";
import { AssignmentContext } from "../Assignment";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";
import { Box, Center } from "@chakra-ui/react";
import AssignmentStatisticCharts from "../../../../../../components/AssignmentStatisticCharts/AssignmentStatisticCharts";
import Loading from "../../../../../../components/Loading/Loading";
import Error from "../../../../../../components/Error/Error";
import TeacherAssignmentSubmissionsTable from "../../../../../../components/TeacherAssignmentSubmissionsTable/TeacherAssignmentSubmissionsTable";

const GET_ASSIGNMENT_SUBMISSION = gql`
  query getAssignmentExportData($assignmentId: ID!) {
    getAssignmentExportData(assignmentId: $assignmentId) {
      userAssignmentSubmission {
        user {
          id
          username
          organisationId
        }
        assignmentSubmissions {
          problem {
            id
            specification {
              title
            }
          }
          submission {
            id
            code
            language
            avgTime
            avgMemory
            passed
            createdAt
            userId
          }
          mark
          comments
        }
      }
      avgMark
      solves
      lastChange
      attempts
      numOfProblems
      comments
    }
  }
`;

const TeacherAssignmentSubmissionsPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  const [userAssignmentSubmissionData, setUserAssignmentSubmissionData] =
    useState<UserAssignmentSubmissionDataRow[]>([]);

  const [getAssignmentSubmissions, { loading, error, data }] = useLazyQuery(
    GET_ASSIGNMENT_SUBMISSION,
    {
      onCompleted: ({ getAssignmentExportData }) => {
        setUserAssignmentSubmissionData(getAssignmentExportData);
      },
      variables: {
        assignmentId: assignment.id,
      },
    }
  );

  useEffect(() => {
    getAssignmentSubmissions();
  }, []);

  if (loading) return <Loading />;
  if (error)
    return (
      <Box px={"12.5%"} pt={8}>
        <Error error={error} />
      </Box>
    );

  return (
    <>
      <Center>
        <AssignmentStatisticCharts
          assignment={assignment}
          userAssignmentSubmissionData={userAssignmentSubmissionData}
        />
      </Center>
      <br />
      <TeacherAssignmentSubmissionsTable
        userAssignmentSubmissionData={userAssignmentSubmissionData}
      />
    </>
  );
};

export default TeacherAssignmentSubmissionsPanel;
