import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Assignment } from "../../gql-types";

const AssignmentBox = ({ assignment }: { assignment: Assignment }) => {
  return (
    <Box
      p={2}
      minw={"100%"}
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
      <Text fontSize="md">{`Due on ${new Date(
        parseInt(assignment.dueDate)
      ).toLocaleString()}`}</Text>
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
