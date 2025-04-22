import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import EmptyResult from "../../vendors/_components/EmptyResult";
import Pagination from "../../suppliers/_components/Pagination";

interface LoanTableProps {
  data: any[];
  columns: any[];
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  loading: boolean;
  setPageCount: (value: number) => void;
  metaData: any;
}

const LoanTable = ({
  data,
  columns,
  globalFilter,
  onGlobalFilterChange,
  loading,
  setPageCount,
  metaData,
}: LoanTableProps) => {
  const table = useReactTable({
    data: data,
    columns: columns,
    state: { globalFilter },
    manualFiltering: true,
    onGlobalFilterChange: onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (data?.length === 0) {
    return (
      <EmptyResult
        heading="No result found"
        content="All loan application will show here"
      />
    );
  }

  return (
    <TableContainer
      border="1px solid #F9FAFB"
      borderRadius="10px"
      overflowX="auto"
      w="100%"
    >
      <Table variant="simple" size="sm">
        <Thead bg="blue.50">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  textTransform="initial"
                  px={{ base: "8px", md: "16px" }}
                  minW="120px"
                  whiteSpace="nowrap"
                  color="primary.500"
                  fontWeight="500"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody bg="white" color="#606060" fontSize="14px">
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}
                  px={{ base: "8px", md: "16px" }}
                  minW="120px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination meta={metaData} setPageCount={setPageCount} />
    </TableContainer>
  );
};

export default LoanTable;
