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
import Loading from "../../Loading/Loading";
import Error from "../../Error/Error";

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

  if (loading) return <Loading />;
  if (error)
    return (
      <Box px={"12.5%"} pt={8}>
        <Error error={error} />
      </Box>
    );

  const assignments: Assignment[] = data.getAssignments;

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
