import React, { useState } from "react";
import { Button, ButtonGroup, Heading, useDisclosure } from "@chakra-ui/react";
import { Submission } from "../../../../gql-types";
import CustomTable from "../../../CustomTable/CustomTable";
import SubmissionModal from "../../../SubmissionModal/SubmissionModal";
import { LanguageCodeToName } from "../../../../utils";

type SubmissionsProps = {
  userSubmissions: Submission[];
  latestSubmission: Submission | null;
};

const Submissions = ({
  userSubmissions,
  latestSubmission,
}: SubmissionsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [modalSubmissionId, setModalSubmissionId] = useState<number>(-1);

  return (
    <>
      <SubmissionModal
        {...{ isOpen, onClose, submissionId: modalSubmissionId }}
      />
      <Heading>Latest Submission</Heading>
      {latestSubmission
        ? JSON.stringify({
            time: new Date(
              parseInt(latestSubmission.createdAt)
            ).toLocaleString(),
            passed: `${latestSubmission.passed}`,
            avgTime: latestSubmission.avgTime.toFixed(2) + " ms",
            avgMemory: latestSubmission.avgMemory.toFixed(2) + " MB",
            language: latestSubmission.language,
          })
        : "You haven't made a submissions yet."}
      <Heading>Your Submissions</Heading>
      <CustomTable
        data={userSubmissions.map((submission: Submission, i: number) => {
          return {
            time: new Date(parseInt(submission.createdAt)).toLocaleString(),
            passed: `${submission.passed}`,
            avgTime: submission.avgTime.toFixed(2) + " ms",
            avgMemory: submission.avgMemory.toFixed(2) + " MB",
            language: LanguageCodeToName[submission.language],
            options: (
              <>
                <ButtonGroup>
                  <Button
                    colorScheme={"teal"}
                    onClick={() => {
                      setModalSubmissionId(parseInt(submission.id));
                      onOpen();
                    }}
                  >
                    View
                  </Button>
                </ButtonGroup>
              </>
            ),
          };
        })}
        columns={[
          {
            Header: "Time",
            accessor: "time",
          },
          {
            Header: "Passed",
            accessor: "passed",
          },
          {
            Header: "Average Time",
            accessor: "avgTime",
          },
          {
            Header: "Average Memory",
            accessor: "avgMemory",
          },
          {
            Header: "Language",
            accessor: "language",
          },
          {
            Header: "Options",
            accessor: "options",
          },
        ]}
      />
    </>
  );
};

export default Submissions;
