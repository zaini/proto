import React, { useMemo } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy } from "react-table";

const ProblemTable = () => {
  const data: any = useMemo(
    () => [
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
    ],
    []
  );

  const columns: any = useMemo(
    () => [
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
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <Table {...getTableProps()} bgColor="#EEEEEE" borderTopRadius={10}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render("Header")}
                <chakra.span pl="4">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ) : (
                      <TriangleUpIcon aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row: any) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell: any) => (
                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default ProblemTable;
