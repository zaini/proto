import React from "react";
import { Box, VStack } from "@chakra-ui/react";
import Assignments from "../../../components/Dashboard/Assignments/Assignments";
import ProblemCatalogues from "../../../components/Dashboard/ProblemCatalogues/ProblemCatalogues";
import ProblemTable from "../../../components/ProblemTable/ProblemTable";

const DashboardHome = () => {
  return (
    <Box>
      <VStack align="stretch">
        <Box bgColor="#C4C4C4" px={"12.5%"} py={12}>
          <Assignments />
        </Box>
        <Box px={"12.5%"} py={12}>
          <ProblemCatalogues />
        </Box>
        <Box px={"12.5%"} pt={12}>
          <ProblemTable />
        </Box>
      </VStack>
    </Box>
  );
};

export default DashboardHome;
