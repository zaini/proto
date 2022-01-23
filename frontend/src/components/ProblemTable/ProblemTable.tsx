import React from "react";
import CustomTable from "../CustomTable/CustomTable";

const ProblemTable = () => {
  return (
    <CustomTable
      data={[
        {
          problem: "Two Sum",
          category: "Arrays/Lists",
          frequency: "Common",
          difficulty: "Easy",
          completed: "true",
        },
        {
          problem: "Edit Distance",
          category: "Dynamic Programming",
          frequency: "Rare",
          difficulty: "Hard",
          completed: "false",
        },
        {
          problem: "Matching Parenthesis",
          category: "Stacks",
          frequency: "Common",
          difficulty: "Easy",
          completed: "true",
        },
      ]}
      columns={[
        {
          Header: "Problem",
          accessor: "problem",
        },
        {
          Header: "Category",
          accessor: "category",
        },
        {
          Header: "Frequency",
          accessor: "frequency",
        },
        {
          Header: "Difficulty",
          accessor: "difficulty",
        },
        {
          Header: "Completed",
          accessor: "completed",
        },
      ]}
    />
  );
};

export default ProblemTable;
