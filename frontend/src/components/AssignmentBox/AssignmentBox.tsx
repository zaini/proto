import React from "react";
import { Box, Text, Button, Tooltip } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Assignment } from "../../gql-types";

const rtf = new Intl.RelativeTimeFormat("en", { style: "narrow" });

const AssignmentBox = ({ assignment }: { assignment: Assignment }) => {
  return (
    <Box
      p={2}
      minW={"280px"}
      backgroundColor={"#EEEEEE"}
      fontWeight={700}
      borderRadius={5}
      boxShadow={"xl"}
      boxSizing={"border-box"}
    >
      <Text fontSize="xl">{assignment.name}</Text>
      <Text fontSize="md" opacity={"50%"}>
        {assignment.classroom.name}
      </Text>
      <Tooltip
        label={`Due on ${new Date(
          parseInt(assignment.dueDate)
        ).toLocaleString()}`}
      >
        <Text fontSize="md">{`Due in ${rtf.format(
          parseInt(
            `${
              (parseInt(assignment.dueDate) - new Date().getTime()) /
              (24 * 60 * 60 * 1000)
            }`
          ),
          "day"
        )}`}</Text>
      </Tooltip>
      <Box textAlign="right" mt={4}>
        <Button
          as={Link}
          colorScheme={"blue"}
          to={`/dashboard/classrooms/${assignment.classroom.id}/assignments/${assignment.id}`}
          fontSize="lg"
        >
          GO
        </Button>
      </Box>
    </Box>
  );
};

export default AssignmentBox;
