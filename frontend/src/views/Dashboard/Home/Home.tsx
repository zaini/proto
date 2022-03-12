import React from "react";
import { Box, VStack } from "@chakra-ui/react";
import ProblemTable from "../../../components/ProblemTable/ProblemTable";
import AssignmentsPreview from "../../../components/Dashboard/AssignmentsPreview/AssignmentsPreview";

const DashboardHome = () => {
  return (
    <VStack align="stretch">
      <Box bgColor="#C4C4C4" px={"12.5%"} py={12}>
        <AssignmentsPreview />
      </Box>
      <Box px={"12.5%"} pt={12}>
        <ProblemTable />
      </Box>
    </VStack>
  );
};

export default DashboardHome;
