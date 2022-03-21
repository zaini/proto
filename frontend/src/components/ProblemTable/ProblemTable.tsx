import React, { useEffect, useState } from "react";
import {
  Center,
  Spinner,
  InputGroup,
  InputLeftAddon,
  Input,
  Heading,
  Select,
  HStack,
} from "@chakra-ui/react";
import CustomTable from "../CustomTable/CustomTable";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";
import { Problem } from "../../gql-types";

const GET_PROBLEMS = gql`
  query getProblems($filter: String) {
    getProblems(filter: $filter) {
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
  const [searchQuery, setSearchQuery] = useState("");

  const [problems, setProblems] = useState<Problem[]>([]);

  const [difficulty, setDifficulty] = useState("all");

  const [typingTimer, setTypingTimer] = useState<any>();

  const [getProblems, { loading, error, data }] = useLazyQuery(GET_PROBLEMS, {
    onCompleted(data) {
      if (data) setProblems(data.getProblems);
    },
  });

  useEffect(() => {
    getProblems();
  }, []);

  const filteredProblems = problems.filter(
    (problem) =>
      difficulty === "all" ||
      problem.specification.difficulty.toLowerCase() === difficulty
  );

  return (
    <>
      <HStack>
        <InputGroup>
          <InputLeftAddon children="Difficulty" />
          <Select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
            }}
          >
            {["all", "easy", "medium", "hard"].map((x) => (
              <option value={x}>{x}</option>
            ))}
          </Select>
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children="Search" />
          <Input
            type="text"
            value={searchQuery}
            placeholder={"Two Sum"}
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
              clearTimeout(typingTimer);
              setTypingTimer(
                setTimeout(() => {
                  getProblems({
                    variables: {
                      filter: query,
                    },
                  });
                }, 250)
              );
            }}
          />
        </InputGroup>
      </HStack>
      <br />
      {loading && (
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
          />
        </Center>
      )}
      <br />
      {filteredProblems.length > 0 ? (
        <CustomTable
          data={filteredProblems
            .filter(
              (problem) =>
                difficulty === "all" ||
                problem.specification.difficulty.toLowerCase() === difficulty
            )
            .map((problem) => {
              return {
                id: problem.id,
                problem: (
                  <a href={`/problems/${problem.id}`}>
                    {problem.specification.title}
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
                  : "Unrated",
                solved: `${problem.solved}`,
              };
            })}
          columns={[
            {
              Header: "ID",
              accessor: "id",
            },
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
      ) : (
        <Center my={16}>
          <Heading size={"md"}>No problems found.</Heading>
        </Center>
      )}
    </>
  );
};

export default ProblemTable;
