"use client";

import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ColumsTransactionFN } from "./table";
import EmptyOrder from "../../orders/_components/EmptyOrder";
import { Table,TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import Pagination from "../../_components/Pagination";
import { Daum, LoanTransactionProps } from "@/types";

const TransactionTable = ({data}: {data: Daum[]}) => {

    const filterTransactions = data?.slice(0, 6);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedRow, setSelectedRow] = useState<LoanTransactionProps>();
    const memoizedData = useMemo(() => filterTransactions, [filterTransactions]);

    const {
        isOpen: isOpenPayout,
        onOpen: onOpenPayout,
        onClose: onClosePayout,
      } = useDisclosure();

    const table = useReactTable({
        data: memoizedData,
        columns: ColumsTransactionFN(onOpen, onOpenPayout),
        state: {},
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

  return (
    <div>
      {
            data?.length === 0 
            ? <EmptyOrder 
            heading={`No Transactions Yet`} 
            content={`You currently have no transaction. All transactions will appear here.`} 
            /> : 
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                <Table>
                    <Thead bg={"#F2F4F7"}>
                    {data && table?.getHeaderGroups()?.map((headerGroup, i) => (
                        <Tr key={i}>
                        {headerGroup.headers?.map((header, idx) => (
                            <Th
                            textTransform={"initial"}
                            px="0px"
                            key={idx}
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
                    {data && table?.getRowModel()?.rows?.map((row, index) => (
                        <Tr key={index}>
                        {row.getVisibleCells()?.map((cell, idxs) => (
                            <Td key={idxs} px="0px">
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
                {/* <Pagination meta={meta} setPageCount={setPageCount}/> */}
            </TableContainer>
        }  
    </div>
  )
}

export default TransactionTable;