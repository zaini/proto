import React, { useContext, useEffect, useState } from "react";
import {
  Assignment,
  UserAssignmentSubmission,
} from "../../../../../../gql-types";
import { AssignmentSubmissionModalData } from "../../../../../../utils";
import { AssignmentContext } from "../Assignment";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import CustomTable from "../../../../../../components/CustomTable/CustomTable";
import AssignmentSubmissionModal from "../../../../../../components/AssignmentSubmissionModal/AssignmentSubmissionModal";
import AssignmentStatisticCharts from "../../../../../../components/AssignmentStatisticCharts/AssignmentStatisticCharts";
import Loading from "../../../../../../components/Loading/Loading";
import Error from "../../../../../../components/Error/Error";
import TeacherAssignmentSubmissionsTable from "../../../../../../components/TeacherAssignmentSubmissionsTable/TeacherAssignmentSubmissionsTable";

const GET_ASSIGNMENT_SUBMISSION = gql`
  query getAssignmentSubmissionsAsTeacher($assignmentId: ID!) {
    getAssignmentSubmissionsAsTeacher(assignmentId: $assignmentId) {
      user {
        id
        username
        organisationId
      }
      assignmentSubmissions {
        createdAt
        mark
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
      }
    }
  }
`;

const TeacherAssignmentSubmissionsPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [assignmentSubmissionModalData, setAssignmentSubmissionModalData] =
    useState<AssignmentSubmissionModalData>({
      assignment: {} as any,
      user: {} as any,
      assignmentSubmissionStats: {} as any,
    });

  const [userAssignmentSubmissions, setUserAssignmentSubmissions] = useState<
    UserAssignmentSubmission[]
  >([]);

  const [getAssignmentSubmissions, { loading, error, data }] = useLazyQuery(
    GET_ASSIGNMENT_SUBMISSION,
    {
      onCompleted: ({ getAssignmentSubmissionsAsTeacher }) => {
        setUserAssignmentSubmissions(getAssignmentSubmissionsAsTeacher);
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
      <AssignmentSubmissionModal
        {...{
          isOpen,
          onClose,
          assignmentSubmissionModalData,
        }}
      />
      <Center>
        <AssignmentStatisticCharts
          assignment={assignment}
          userAssignmentSubmissions={userAssignmentSubmissions}
        />
      </Center>
      <br />
      <TeacherAssignmentSubmissionsTable
        userAssignmentSubmissions={userAssignmentSubmissions}
        setAssignmentSubmissionModalData={setAssignmentSubmissionModalData}
        onOpen={onOpen}
      />
    </>
  );
};

export default TeacherAssignmentSubmissionsPanel;
