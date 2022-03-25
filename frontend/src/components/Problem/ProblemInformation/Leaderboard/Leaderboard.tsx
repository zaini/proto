import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Submission } from "../../../../gql-types";
import { LanguageCodeToName } from "../../../../utils";
import { ProblemContext } from "../../../../views/Problem/Problem";
import CustomTable from "../../../CustomTable/CustomTable";
import Error from "../../../Error/Error";
import Loading from "../../../Loading/Loading";
import SubmissionModal from "../../../SubmissionModal/SubmissionModal";
import { useQuery, gql } from "@apollo/client";

const GET_SUBMISSIONS = gql`
  query getTopKSubmissionForProblem($problemId: ID!, $k: Int!) {
    getTopKSubmissionForProblem(problemId: $problemId, k: $k) {
      id
      user {
        id
        username
      }
      avgTime
      avgMemory
      language
    }
  }
`;

const Leaderboard = () => {
  const problem = useContext(ProblemContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [modalSubmissionId, setModalSubmissionId] = useState<number>(-1);

  const { loading, error, data } = useQuery(GET_SUBMISSIONS, {
    variables: {
      problemId: problem.id,
      k: 50,
    },
  });

  if (loading) return <Loading />;
  if (error)
    return (
      <Box px={"12.5%"} pt={8}>
        <Error error={error} />
      </Box>
    );

  const submissions: Submission[] = data.getTopKSubmissionForProblem;

  return (
    <Box>
      <SubmissionModal
        {...{ isOpen, onClose, submissionId: modalSubmissionId }}
      />

      {submissions.length > 0 ? (
        <CustomTable
          data={submissions.map((submission: Submission) => {
            return {
              user: (
                <Link href={`/profile/${submission.user.id}`}>
                  {submission.user.username}
                </Link>
              ),
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
              Header: "User",
              accessor: "user",
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
          <Text fontWeight={"bold"}>
            No submissions made for leaderboard. Be the first!
          </Text>
          <br />
        </>
      )}
    </Box>
  );
};

export default Leaderboard;
