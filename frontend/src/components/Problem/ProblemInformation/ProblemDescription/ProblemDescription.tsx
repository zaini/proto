import React, { useContext, useEffect, useState } from "react";
import { Text, Code, Box } from "@chakra-ui/layout";
import { ProblemContext } from "../../../../views/Problem/Problem";
import { Rating } from "react-simple-star-rating";
import { gql, useMutation } from "@apollo/client";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

const RATE_PROBLEM = gql`
  mutation rateProblem($problemId: ID!, $score: Float!) {
    rateProblem(problemId: $problemId, score: $score)
  }
`;

const ProblemDescription = () => {
  const problem = useContext(ProblemContext);

  console.log(problem.rating);

  const [rating, setRating] = useState(
    problem.rating.userRating ? problem.rating.userRating.score : 0
  );

  const [rateProblem] = useMutation(RATE_PROBLEM);

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
            : "Unrated"}
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
            const newRating = r / 20;
            setRating(newRating);
            rateProblem({
              variables: {
                problemId: problem.id,
                score: newRating,
              },
            });
          }}
          ratingValue={rating * 20}
        />
      </Box>
      <br />
      <Box>
        <ReactMarkdown components={ChakraUIRenderer()}>
          {problem.specification.description}
        </ReactMarkdown>
      </Box>
    </>
  );
};

export default ProblemDescription;
