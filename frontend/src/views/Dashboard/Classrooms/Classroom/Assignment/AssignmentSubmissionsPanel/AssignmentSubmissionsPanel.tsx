import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../../context/Auth";
import {
  Assignment,
  AssignmentProblemSubmissions,
  Submission,
} from "../../../../../../gql-types";
import { AccountType } from "../../../../../../utils";
import { AssignmentContext } from "../Assignment";
import gql from "graphql-tag";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Center, List, ListItem, Spinner } from "@chakra-ui/react";

const GET_ASSIGNMENT_SUBMISSIONS = gql`
  query getSubmissionsForAssignment($assignmentId: ID!) {
    getSubmissionsForAssignment(assignmentId: $assignmentId) {
      problem {
        id
        specification {
          title
        }
      }
      submissions {
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
`;

const AssignmentSubmissionsPanel = () => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  const { accountType }: any = useContext(AuthContext);

  const [problemSubmissions, setProblemSubmissions] = useState<
    AssignmentProblemSubmissions[]
  >([]);

  const [getProblemSubmissions, { loading, error, data }] = useLazyQuery(
    GET_ASSIGNMENT_SUBMISSIONS,
    {
      onCompleted: ({ getSubmissionsForAssignment }) => {
        setProblemSubmissions(getSubmissionsForAssignment);
      },
      variables: {
        assignmentId: assignment.id,
      },
    }
  );

  useEffect(() => {
    getProblemSubmissions();
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

  console.log(problemSubmissions);

  return (
    <>
      all submissions {assignment.id}
      {accountType === AccountType.Teacher ? (
        <p>
          teacher sees a list of all students and their submissions or lack of
          submission with some basic stats. they can click on the submission to
          open a modal with details about the submission including the code.
        </p>
      ) : (
        <>
          students see list of the submissions to the problem since the creation
          of the assignment and they can assign any of their submissions to be
          the submission for each problem in the assignment. they can change
          this any time.
          <br />
          <br />
          <br />
          {problemSubmissions.map(
            (x: AssignmentProblemSubmissions, i: number) => {
              const problem = x.problem;
              const submissions = x.submissions;

              return (
                <>
                  Problem: # {problem.id} {problem.specification.title}
                  <br />
                  Submissions:
                  <br />
                  <List>
                    {submissions?.map((submission: Submission) => {
                      return (
                        <ListItem>
                          {submission.id} {"" + submission.passed}
                        </ListItem>
                      );
                    })}
                  </List>
                </>
              );
            }
          )}
        </>
      )}
    </>
  );
};

export default AssignmentSubmissionsPanel;
