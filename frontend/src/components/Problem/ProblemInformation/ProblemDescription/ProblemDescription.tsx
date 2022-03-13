import React, { useContext, useEffect, useState } from "react";
import { Heading, Text, Code, Box } from "@chakra-ui/layout";
import { ProblemContext } from "../../../../views/Problem/Problem";
import { Rating } from "react-simple-star-rating";
import { gql, useMutation } from "@apollo/client";

const RATE_PROBLEM = gql`
  mutation rateProblem($problemId: ID!, $score: Float!) {
    rateProblem(problemId: $problemId, score: $score)
  }
`;

const ProblemDescription = () => {
  const problem = useContext(ProblemContext);

  const [rating, setRating] = useState(
    problem.rating.userRating ? problem.rating.userRating.score : 0
  );

  const [rateProblem] = useMutation(RATE_PROBLEM);

  useEffect(() => {
    rateProblem({
      variables: {
        problemId: problem.id,
        score: rating,
      },
    });
  }, [rating]);

  return (
    <>
      <Text>
        <Code>Number of Ratings: {problem.rating.numberOfRatings}</Code>{" "}
        <Code>
          Average Rating:{" "}
          {problem.rating.numberOfRatings
            ? Math.round(
                (problem.rating.totalRating / problem.rating.numberOfRatings) *
                  10
              ) / 10
            : "N/A"}
        </Code>{" "}
        <Code>
          Your rating:{" "}
          {problem.rating.userRating ? problem.rating.userRating.score : "N/A"}
        </Code>{" "}
        <Code>Created by {problem.creator.username}</Code>
      </Text>
      <br />
      <Box>
        <Rating
          size={28}
          transition
          onClick={(r) => {
            setRating(r / 20);
          }}
          ratingValue={rating * 20}
        />
      </Box>
      <br />
      <Text>{problem.specification.description}</Text>

      {/* TODO do this properly lol */}
      <Heading size={"md"} mb={2} mt={4}>
        Example 1
      </Heading>
      <Code>
        Input: 1 2
        <br />
        Output: 3
      </Code>

      <Heading size={"md"} mb={2} mt={4}>
        Example 2
      </Heading>
      <Code>
        Input: 5 7
        <br />
        Output: 12
      </Code>
    </>
  );
};

export default ProblemDescription;
