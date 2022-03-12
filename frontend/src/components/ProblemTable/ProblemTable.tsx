import React from "react";
import { Center, Spinner } from "@chakra-ui/react";
import CustomTable from "../CustomTable/CustomTable";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

const GET_PROBLEMS = gql`
  query getProblems {
    getProblems {
      id
      creator {
        username
      }
      likes
      dislikes
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

  const problems = data.getProblems;

  console.log(problems);

  return (
    <CustomTable
      data={[
        {
          problem: "Two Sum",
          category: "Arrays/Lists",
          frequency: "Common",
          difficulty: "Easy",
          completed: "true",
        },
        {
          problem: "Edit Distance",
          category: "Dynamic Programming",
          frequency: "Rare",
          difficulty: "Hard",
          completed: "false",
        },
        {
          problem: "Matching Parenthesis",
          category: "Stacks",
          frequency: "Common",
          difficulty: "Easy",
          completed: "true",
        },
      ]}
      columns={[
        {
          Header: "Problem",
          accessor: "problem",
        },
        {
          Header: "Category",
          accessor: "category",
        },
        {
          Header: "Frequency",
          accessor: "frequency",
        },
        {
          Header: "Difficulty",
          accessor: "difficulty",
        },
        {
          Header: "Completed",
          accessor: "completed",
        },
      ]}
    />
  );
};

export default ProblemTable;
