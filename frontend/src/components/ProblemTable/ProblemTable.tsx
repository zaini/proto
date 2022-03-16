import React from "react";
import { Center, Spinner } from "@chakra-ui/react";
import CustomTable from "../CustomTable/CustomTable";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Problem } from "../../gql-types";

const GET_PROBLEMS = gql`
  query getProblems {
    getProblems {
      id
      creator {
        username
      }
      rating {
        numberOfRatings
        totalRating
      }
      specification {
        difficulty
        title
      }
      solved
    }
  }
`;

const ProblemTable = () => {
  const { loading, error, data } = useQuery(GET_PROBLEMS);

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
  if (error) return <>Error! {error.message}</>;

  const problems: Problem[] = data.getProblems;

  return (
    <CustomTable
      data={problems.map((problem) => {
        return {
          problem: (
            <a href={`/problems/${problem.id}`}>
              {problem.specification.title}
            </a>
          ),
          difficulty: problem.specification.difficulty.toLowerCase(),
          totalRatings: problem.rating.numberOfRatings,
          avgRating: problem.rating.numberOfRatings
            ? Math.round(
                (problem.rating.totalRating / problem.rating.numberOfRatings) *
                  10
              ) / 10
            : "N/A",
          solved: `${problem.solved}`,
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
        {
          Header: "Solved",
          accessor: "solved",
        },
      ]}
    />
  );
};

export default ProblemTable;
