import React, { useMemo } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  Flex,
  IconButton,
  Box,
  Text,
  Select,
  chakra,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy, usePagination } from "react-table";
import {
  BiChevronsLeft,
  BiChevronsRight,
  BiChevronLeft,
  BiChevronRight,
} from "react-icons/bi";

// Pagination from: https://codesandbox.io/s/o6psn?file=/src/Table/index.tsx:4910-5280
declare module "react-table" {
  export interface TableOptions<D extends object>
    extends UsePaginationOptions<D>,
      UseFiltersOptions<D> {}

  export interface TableInstance<D extends object = {}>
    extends UsePaginationInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UsePaginationState<D> {}

  export interface ColumnInstance<D extends object = {}>
    extends UseSortByColumnProps<D> {}
}

type CustomTableProps = {
  data: {}[];
  columns: { Header: string; accessor: string }[];
};

const CustomTable = ({ data, columns }: CustomTableProps) => {
  const tableData: any = useMemo(() => data, [data]);

  const tableColumns: any = useMemo(() => columns, [columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
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
          {page.map((row, key) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => (
                  <Td
                    {...cell.getCellProps()}
                    isNumeric={cell.column.isNumeric}
                  >
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex
        justifyContent="space-between"
        flexDirection="row"
        m={4}
        backgroundColor={"#ffffff"}
      >
        <Flex flexDirection="row">
          <IconButton
            mr={2}
            aria-label="start"
            icon={<BiChevronsLeft size={20} />}
            onClick={() => gotoPage(0)}
            isDisabled={!canPreviousPage}
          />
          <IconButton
            mr={2}
            aria-label="left"
            icon={<BiChevronLeft size={20} />}
            onClick={() => previousPage()}
            isDisabled={!canPreviousPage}
          />
        </Flex>

        <Flex justifyContent="center" alignItems="center">
          <Text mr={4} whiteSpace={"nowrap"}>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </Text>

          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex flexDirection="row">
          <IconButton
            ml={2}
            aria-label="right"
            icon={<BiChevronRight size={20} />}
            onClick={() => nextPage()}
            isDisabled={!canNextPage}
          />
          <IconButton
            ml={2}
            aria-label="end"
            icon={<BiChevronsRight size={20} />}
            onClick={() => gotoPage(pageCount ? pageCount - 1 : 1)}
            isDisabled={!canNextPage}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default CustomTable;
