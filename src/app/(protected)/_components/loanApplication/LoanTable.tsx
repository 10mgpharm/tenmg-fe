import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td, Spinner, Flex } from '@chakra-ui/react';
import EmptyResult from '../../vendors/_components/EmptyResult';

interface LoanTableProps {
  data: any[];
  columns: any[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  loading: boolean;
}

const LoanTable = ({ data, columns, globalFilter, onGlobalFilterChange, loading }: LoanTableProps) => {
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
    return <EmptyResult heading="Nothing to show here" content="" />;
  }

  return (
    <TableContainer border="1px solid #F9FAFB" borderRadius="10px">
      <Table>
        <Thead bg="blue.50">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  textTransform="initial"
                  px="0px"
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
                <Td key={cell.id} px="0px">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default LoanTable;
