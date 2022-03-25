import { Button, ButtonGroup, Link } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Assignment, UserAssignmentSubmission } from "../../gql-types";
import { AssignmentContext } from "../../views/Dashboard/Classrooms/Classroom/Assignment/Assignment";
import CustomTable from "../CustomTable/CustomTable";

type Props = {
  userAssignmentSubmissions: UserAssignmentSubmission[];
  setAssignmentSubmissionModalData: any;
  onOpen: any;
};

const TeacherAssignmentSubmissionsTable = ({
  userAssignmentSubmissions,
  onOpen,
  setAssignmentSubmissionModalData,
}: Props) => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);

  return (
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

        const totalMarks = assignmentSubmissions.reduce(
          (total, assignmentSubmission) =>
            total + (assignmentSubmission.mark ? assignmentSubmission.mark : 0),
          0
        );

        const avgMark = (totalMarks / numOfProblems).toFixed(2);

        const assignmentSubmissionStats = {
          learner: <Link href={`/profile/${user.id}`}>{user.username}</Link>,
          organisationId: user.organisationId,
          attempted: `${attempts}/${numOfProblems}`,
          avgMark: `${avgMark}/100`,
          solved: `${solves}/${numOfProblems}`,
          lastChange:
            lastChange === -Infinity
              ? "N/A"
              : new Date(lastChange).toLocaleString(),
        };

        return {
          ...assignmentSubmissionStats,
          options: (
            <ButtonGroup>
              <Button
                colorScheme={"blue"}
                // disabled={assignmentSubmissions?.length === 0}
                onClick={() => {
                  setAssignmentSubmissionModalData({
                    assignment,
                    user,
                    assignmentSubmissionStats,
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
        {
          Header: "Organisation ID",
          accessor: "organisationId",
        },
        { Header: "Problems Attempted", accessor: "attempted" },
        { Header: "Problems Solved", accessor: "solved" },
        { Header: "Average Mark", accessor: "avgMark" },
        { Header: "Last Submission Change", accessor: "lastChange" },
        {
          Header: "Options",
          accessor: "options",
        },
      ]}
    />
  );
};

export default TeacherAssignmentSubmissionsTable;
