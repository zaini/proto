import React from "react";
import { Box, Button, VStack } from "@chakra-ui/react";
import ProblemTable from "../../../components/ProblemTable/ProblemTable";
import AssignmentsPreview from "../../../components/Dashboard/AssignmentsPreview/AssignmentsPreview";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  return (
    <VStack align="stretch">
      <Box bgColor="#C4C4C4" px={"12.5%"} py={12}>
        <AssignmentsPreview />
      </Box>

      <Box px={"12.5%"}>
        <Box my={12}>
          <Link to={`/problems/new`}>
            <Button colorScheme={"blue"}>+ Create New Problem</Button>
          </Link>
        </Box>

        <ProblemTable />
      </Box>
    </VStack>
  );
};

export default DashboardHome;
