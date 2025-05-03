import { useMemo, useState } from "react";
import { LoanTransactionProps } from "@/types";
import { loanColumnFn } from "./columns/loanColumn";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import { Flex, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import {  flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import TransactionDetails from "./TransactionDetail";

interface LoanTableProps {
    data: LoanTransactionProps[];
}

const LoanTable = ({data}: LoanTableProps) => {
    
    const filterTransactions = data?.slice(0, 6);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedRow, setSelectedRow] = useState<LoanTransactionProps>();
    const memoizedData = useMemo(() => filterTransactions, [filterTransactions]);

    const table = useReactTable({
        data: memoizedData,
        columns: loanColumnFn(onOpen, setSelectedRow),
        state: {},
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
    <div>
      {data?.length === 0 ? (
        <EmptyOrder
          heading={`No Wallet Yet`}
          content={`You currently have no wallet. All wallets will appear here.`}
        />
      ) : data?.length > 0 ? (
        <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
          <Table>
            <Thead bg={"#F2F4F7"}>
              {table?.getHeaderGroups()?.map((headerGroup, index) => (
                <Tr key={index}>
                  {headerGroup.headers?.map((header, idx) => (
                    <Th textTransform={"initial"} px="6px" key={idx}>
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
              {table?.getRowModel()?.rows?.map((row, i) => (
                <Tr key={i}>
                  {row.getVisibleCells()?.map((cell, ix) => (
                    <Td key={ix} px="6px">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* {hasPagination && metaData && setPageCount && (
            <Pagination {...metaData} setPageCount={setPageCount} />
          )} */}
        </TableContainer>
      ): (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      )}
      <TransactionDetails 
      selectedRow={selectedRow} 
      isOpen={isOpen} 
      onClose={onClose} 
      type="" 
      />
    </div>
  );
};
export default LoanTable;