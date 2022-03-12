import React, { useRef } from "react";
import {
  Box,
  Heading,
  HStack,
  Center,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Assignment } from "../../../gql-types";
import AssignmentBox from "../../AssignmentBox/AssignmentBox";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const GET_ASSIGNMENTS = gql`
  query getAssignments {
    getAssignments {
      id
      dueDate
      createdAt
      name
      classroom {
        id
        name
      }
    }
  }
`;

// From: https://codesandbox.io/s/mxe72?file=/src/styles.ts:657-665
const sideScroll = (
  element: HTMLDivElement,
  speed: number,
  distance: number,
  step: number
) => {
  let scrollAmount = 0;
  const slideTimer = setInterval(() => {
    element.scrollLeft += step;
    scrollAmount += Math.abs(step);
    if (scrollAmount >= distance) {
      clearInterval(slideTimer);
    }
  }, speed);
};

const AssignmentsPreview = () => {
  const { loading, error, data } = useQuery(GET_ASSIGNMENTS);

  const contentWrapper = useRef(null);

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

  const assignments: Assignment[] = data.getAssignments;

  console.log(assignments);

  if (assignments.length === 0) {
    return (
      <Box>
        <Heading size="lg">You have 0 assignments! 🥳</Heading>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={12}>
        You have {assignments.length} assignments!
      </Heading>

      <HStack>
        <IconButton
          aria-label="left"
          icon={<ChevronLeftIcon />}
          onClick={() => {
            sideScroll(contentWrapper.current as any, 25, 100, -10);
          }}
        />

        <HStack
          spacing={8}
          overflow={"hidden"}
          whiteSpace={"nowrap"}
          width="100%"
          ref={contentWrapper}
        >
          {assignments.map((assignment) => {
            return <AssignmentBox assignment={assignment} />;
          })}
        </HStack>

        <IconButton
          aria-label="right"
          icon={<ChevronRightIcon />}
          onClick={() => {
            sideScroll(contentWrapper.current as any, 25, 100, 10);
          }}
        />
      </HStack>
    </Box>
  );
};

export default AssignmentsPreview;
