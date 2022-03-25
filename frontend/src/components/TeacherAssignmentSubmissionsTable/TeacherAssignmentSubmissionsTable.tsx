import React, { useContext, useState } from "react";
import { Button, ButtonGroup, Link, useDisclosure } from "@chakra-ui/react";
import { Assignment, UserAssignmentSubmissionDataRow } from "../../gql-types";
import { AssignmentContext } from "../../views/Dashboard/Classrooms/Classroom/Assignment/Assignment";
import CustomTable from "../CustomTable/CustomTable";
import { CSVLink } from "react-csv";
import { AssignmentSubmissionModalData } from "../../utils";
import AssignmentSubmissionModal from "../AssignmentSubmissionModal/AssignmentSubmissionModal";

type Props = {
  userAssignmentSubmissionData: UserAssignmentSubmissionDataRow[];
};

const TeacherAssignmentSubmissionsTable = ({
  userAssignmentSubmissionData,
}: Props) => {
  const { assignment }: { assignment: Assignment } =
    useContext(AssignmentContext);
  const [assignmentSubmissionModalData, setAssignmentSubmissionModalData] =
    useState<AssignmentSubmissionModalData>({
      assignment: {} as any,
      user: {} as any,
      assignmentSubmissionStats: {} as any,
    });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AssignmentSubmissionModal
        {...{
          isOpen,
          onClose,
          assignmentSubmissionModalData,
        }}
      />

      <CSVLink
        filename={`${assignment.classroom.id}-${assignment.classroom.name}-${
          assignment.name
        }-${new Date().toLocaleDateString()}.csv`}
        data={userAssignmentSubmissionData.map((row) => {
          return {
            organisationId: row.userAssignmentSubmission.user.organisationId,
            username: row.userAssignmentSubmission.user.username,
            avgMark: row.avgMark,
            solved: row.solves === row.numOfProblems,
            lastChange: row.lastChange || "N/A",
            comments: row.comments,
          };
        })}
      >
        <Button colorScheme={"blue"}>Export CSV</Button>
      </CSVLink>
      <br />
      <br />
      <CustomTable
        data={userAssignmentSubmissionData.map((row) => {
          const assignmentSubmissionStats = {
            learner: (
              <Link href={`/profile/${row.userAssignmentSubmission.user.id}`}>
                {row.userAssignmentSubmission.user.username}
              </Link>
            ),
            organisationId: row.userAssignmentSubmission.user.organisationId,
            attempted: `${row.attempts}/${row.numOfProblems}`,
            avgMark: `${row.avgMark}/100`,
            solved: `${row.solves}/${row.numOfProblems}`,
            lastChange: row.lastChange || "N/A",
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
                      user: row.userAssignmentSubmission.user,
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
    </>
  );
};

export default TeacherAssignmentSubmissionsTable;
