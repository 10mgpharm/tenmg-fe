import { Th, Thead, Tr, Tbody, Td, Table } from "@chakra-ui/react";
import { TableContainer } from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";

const TransactionTab = ({
  table,
  setPageCount,
  transactions,
}: {
  table: any;
  setPageCount: any;
  transactions: any;
}) => {
  return (
    <TableContainer border="1px solid #F9FAFB" borderRadius="10px">
      <Table variant="simple">
        <Thead bg={"blue.50"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  textTransform="initial"
                  color="primary.500"
                  fontWeight="500"
                  key={header.id}
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
        <Tbody bg={"white"} color="#606060" fontSize={"14px"}>
          {table.getRowModel().rows.map((row) => (
            <Tr
              key={row.original.id || row.id}
              className="border-b border-b-slate-400 text-xs"
            >
              {row.getVisibleCells().map((cell) => (
                <Td key={`${row.original.id || row.id}_${cell.column.id}`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination meta={transactions?.meta} setPageCount={setPageCount} />
    </TableContainer>
  );
};

export default TransactionTab;
