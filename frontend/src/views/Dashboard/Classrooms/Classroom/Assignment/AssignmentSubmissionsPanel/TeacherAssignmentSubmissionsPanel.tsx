import React, { useContext, useEffect, useState } from "react";
import {
  Assignment,
  AssignmentSubmission,
  UserAssignmentSubmission,
} from "../../../../../../gql-types";
import { AssignmentSubmissionQueryData } from "../../../../../../utils";
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

const GET_ASSIGNMENT_SUBMISSION = gql`
  query getAssignmentSubmissionsAsTeacher($assignmentId: ID!) {
    getAssignmentSubmissionsAsTeacher(assignmentId: $assignmentId) {
      user {
        id
        username
      }
      assignmentSubmissions {
        createdAt
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
  const [assignmentSubmissionQueryData, setAssignmentSubmissionQueryData] =
    useState<AssignmentSubmissionQueryData>({
      assignment: {} as any,
      user: {} as any,
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

  return (
    <>
      <AssignmentSubmissionModal
        {...{
          isOpen,
          onClose,
          assignmentSubmissionQueryData,
        }}
      />
      <Box>
        <CustomTable
          data={userAssignmentSubmissions.map((userAssignmentSubmission) => {
            const user = userAssignmentSubmission.user;
            const assignmentSubmissions =
              userAssignmentSubmission.assignmentSubmissions;

            const numOfProblems = assignment.problems?.length;

            const attempts = assignmentSubmissions?.length;

            const solves = assignmentSubmissions?.filter(
              (assignmentSubmission) => assignmentSubmission?.submission?.passed
            ).length;

            const lastChange = Math.max.apply(
              Math,
              assignmentSubmissions!.map((o) => {
                return o?.createdAt ? parseInt(o?.createdAt) : -Infinity;
              })
            );

            return {
              learner: user.username,
              attempted: `${attempts}/${numOfProblems}`,
              solved: `${solves}/${numOfProblems}`,
              lastChange:
                lastChange === -Infinity
                  ? "N/A"
                  : new Date(lastChange).toLocaleString(),
              options: (
                <ButtonGroup>
                  <Button
                    colorScheme={"blue"}
                    disabled={assignmentSubmissions?.length === 0}
                    onClick={() => {
                      setAssignmentSubmissionQueryData({
                        assignment,
                        user,
                      });
                      onOpen();
                    }}
                  >
                    View Submission
                  </Button>
                </ButtonGroup>
              ),
            };
          })}
          columns={[
            {
              Header: "Learner",
              accessor: "learner",
            },
            { Header: "Problems Attempted", accessor: "attempted" },
            { Header: "Problems Solved", accessor: "solved" },
            { Header: "Last Submission Change", accessor: "lastChange" },
            {
              Header: "Options",
              accessor: "options",
            },
          ]}
        />
      </Box>
    </>
  );
};

export default TeacherAssignmentSubmissionsPanel;
