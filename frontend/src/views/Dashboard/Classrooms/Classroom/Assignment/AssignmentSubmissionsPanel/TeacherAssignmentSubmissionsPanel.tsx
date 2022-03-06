import React, { useContext, useEffect, useState } from "react";
import {
  Assignment,
  User,
  UserAssignmentSubmission,
} from "../../../../../../gql-types";
import { AssignmentSubmissionMap } from "../../../../../../utils";
import { AssignmentContext } from "../Assignment";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import CustomTable from "../../../../../../components/CustomTable/CustomTable";

const GET_ASSIGNMENT_SUBMISSION = gql`
  query getAssignmentSubmissionsAsTeacher($assignmentId: ID!) {
    getAssignmentSubmissionsAsTeacher(assignmentId: $assignmentId) {
      user {
        id
        username
      }
      assignmentSubmission {
        problem {
          id
          specification {
            title
          }
        }
        submission {
          id
          passed
          avgTime
          avgMemory
          language
          createdAt
          submissionResults {
            passed
          }
        }
      }
    }
  }
`;

const TeacherAssignmentSubmissionsPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  // const [userAssignmentSubmissions, setUserAssignmentSubmissions] = useState<
  //   {
  //     user: User;
  //     assignmentSubmission: AssignmentSubmissionMap;
  //   }[]
  // >([]);

  const [userAssignmentSubmissions, setUserAssignmentSubmissions] = useState<
    UserAssignmentSubmission[]
  >([]);

  const [getAssignmentSubmissions, { loading, error, data }] = useLazyQuery(
    GET_ASSIGNMENT_SUBMISSION,
    {
      onCompleted: ({ getAssignmentSubmissionsAsTeacher }) => {
        // const x = getAssignmentSubmissionsAsTeacher.map(
        //   (uas: UserAssignmentSubmission) => {
        //     const ass = uas.assignmentSubmission
        //       ? uas.assignmentSubmission.reduce(
        //           (a: any, v: any) => ({
        //             ...a,
        //             [v.problem.id]: v,
        //           }),
        //           {}
        //         )
        //       : {};
        //     return {
        //       user: uas.user,
        //       assignmentSubmission: ass,
        //     };
        //   }
        // );
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
      <p>
        teacher sees a list of all students and their submissions or lack of
        submission with some basic stats. they can click on the submission to
        open a modal with details about the submission including the code.
      </p>
      <br />
      <Box my={4}>
        <Heading>Current submission for this assignment</Heading>
        <CustomTable
          data={userAssignmentSubmissions.map((userAssignmentSubmission) => {
            const user = userAssignmentSubmission.user;
            const assignmentSubmission =
              userAssignmentSubmission.assignmentSubmission;

            const numOfProblems = assignment.problems?.length;

            const attempts = assignmentSubmission?.length;

            const solves = assignmentSubmission?.filter(
              (assignmentSubmission) => assignmentSubmission?.submission?.passed
            ).length;

            const lastChange = Math.max.apply(
              Math,
              assignmentSubmission!.map((o) => {
                return o?.submission?.createdAt
                  ? parseInt(o?.submission?.createdAt)
                  : -Infinity;
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
                    disabled={assignmentSubmission?.length === 0}
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
