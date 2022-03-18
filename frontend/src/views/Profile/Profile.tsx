import React, { useState } from "react";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Problem, Submission, User } from "../../gql-types";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import HeatMap from "@uiw/react-heat-map";
import Tooltip from "@uiw/react-tooltip";
import CustomTable from "../../components/CustomTable/CustomTable";
import { LanguageCodeToName } from "../../utils";
import SubmissionModal from "../../components/SubmissionModal/SubmissionModal";

const GET_USER = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      githubId
      problems {
        id
        rating {
          numberOfRatings
          totalRating
        }
        specification {
          difficulty
          title
        }
      }
      recentSubmissions {
        id
        passed
        avgTime
        avgMemory
        language
        createdAt
        problem {
          id
          specification {
            title
          }
        }
      }
      createdAt
    }
  }
`;

const getSubmissionCounts = (submissions: Submission[]) => {
  let counts: any = {};

  submissions.forEach((submission) => {
    const rawDate = new Date(parseInt(submission.createdAt));
    const date = `${rawDate.getFullYear()}/${rawDate.getMonth()}/${rawDate.getDay()}`;
    if (counts[date]) {
      counts[date] += 1;
    } else {
      counts[date] = 1;
    }
  });

  return Object.entries(counts);
};

const Profile = () => {
  const { userId } = useParams();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [modalSubmissionId, setModalSubmissionId] = useState<number>(-1);

  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userId: userId,
    },
  });

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
  if (error) return <>Could not find user. {error.message}</>;

  const profile: User = data.getUser;

  const submissions = profile.recentSubmissions || [];
  const submissionCounts = getSubmissionCounts(submissions);
  const dateSixMonthsAgo = new Date();
  dateSixMonthsAgo.setMonth(dateSixMonthsAgo.getMonth() - 6);

  const problems = profile.problems || [];

  return (
    <>
      <SubmissionModal
        {...{ isOpen, onClose, submissionId: modalSubmissionId }}
      />
      <Box px={"12.5%"} pt={8}>
        <Heading size={"2xl"}>
          <Avatar
            size={"lg"}
            src={`https://avatars.githubusercontent.com/u/${profile.githubId}`}
          />{" "}
          {profile.username}
        </Heading>
        <Heading size={"md"}>
          Joined on {new Date(parseInt(profile.createdAt)).toLocaleDateString()}
        </Heading>
        <br />
        <Heading size={"lg"}>Recent Submissions</Heading>
        <br />
        <Center>
          <HeatMap
            rectSize={14}
            width={600}
            value={submissionCounts.map(([date, count]: any) => {
              return { date, count, content: "" };
            })}
            panelColors={{
              0: "#EBEDF0",
              4: "#8bd8e4",
              8: "#70b5ba",
              12: "#5c979c",
              32: "#467478",
            }}
            startDate={dateSixMonthsAgo}
            rectRender={(props, data) => {
              if (!data.count || data.count === 0) {
                return;
              }
              return (
                <Tooltip
                  key={props.key}
                  placement="top"
                  content={`Submissions: ${data.count || 0}`}
                >
                  <rect {...props} />
                </Tooltip>
              );
            }}
          />
        </Center>
        <br />
        {submissions.length > 0 ? (
          <CustomTable
            data={submissions.map((submission: Submission) => {
              return {
                problem: (
                  <a href={`/problems/${submission.problem.id}`}>
                    #{submission.problem.id}{" "}
                    {submission.problem.specification.title}
                  </a>
                ),
                time: new Date(parseInt(submission.createdAt)).toLocaleString(),
                passed: `${submission.passed}`,
                language: LanguageCodeToName[submission.language],
                avgTime: submission.avgTime.toFixed(2) + " ms",
                avgMemory: submission.avgMemory.toFixed(2) + " MB",
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
                Header: "Problem",
                accessor: "problem",
              },
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
          <Text fontWeight={"bold"}>No Recent Submissions</Text>
        )}
        <br />
        <br />
        <Heading size={"lg"}>Created Problems</Heading>
        <br />
        {problems.length > 0 ? (
          <CustomTable
            data={problems.map((problem: Problem) => {
              return {
                problem: (
                  <a href={`/problems/${problem.id}`}>
                    #{problem.id} {problem.specification.title}
                  </a>
                ),
                difficulty: problem.specification.difficulty.toLowerCase(),
                totalRatings: problem.rating.numberOfRatings,
                avgRating: problem.rating.numberOfRatings
                  ? Math.round(
                      (problem.rating.totalRating /
                        problem.rating.numberOfRatings) *
                        10
                    ) / 10
                  : "N/A",
              };
            })}
            columns={[
              {
                Header: "Problem",
                accessor: "problem",
              },
              {
                Header: "Difficulty",
                accessor: "difficulty",
              },
              {
                Header: "Total Ratings",
                accessor: "totalRatings",
              },
              {
                Header: "Average Rating",
                accessor: "avgRating",
              },
            ]}
          />
        ) : (
          <>
            <Text fontWeight={"bold"}>No Created Problems</Text>
            <br />
          </>
        )}
      </Box>
    </>
  );
};

export default Profile;
