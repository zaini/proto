import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
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
      <br />
      {latestSubmission
        ? JSON.stringify({
            time: new Date(
              parseInt(latestSubmission.createdAt)
            ).toLocaleString(),
            passed: `${latestSubmission.passed}`,
            avgTime: latestSubmission.avgTime.toFixed(2) + " ms",
            avgMemory: latestSubmission.avgMemory.toFixed(2) + " MB",
            language: LanguageCodeToName[latestSubmission.language],
          })
        : "You haven't made a submissions yet."}
      <br />
      <br />
      <Heading>Your Submissions</Heading>
      <br />
      {userSubmissions.length > 0 ? (
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
                      colorScheme={"blue"}
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
      ) : (
        <>
          <Text fontWeight={"bold"}>No submissions made</Text>
          <br />
        </>
      )}
    </>
  );
};

export default Submissions;
