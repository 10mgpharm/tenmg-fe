"use client";

import { 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ColumsTransactionFN } from "./table";
import EmptyOrder from "../../orders/_components/EmptyOrder";
import { Flex, Spinner, Table,TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { Daum } from "@/types";
import Pagination from "@/app/(protected)/admin/products/_components/Pagination";
import TransactionDetails from "@/app/(protected)/admin/wallet/_components/TransactionDetail";

interface TransactionTableProps {
    data: Daum[];
    globalFilter?: string;
    hasPagination: boolean;
    setPageCount?: Dispatch<SetStateAction<number>>;
    metaData?: {
        links: any;
        prevPageUrl: string | null;
        nextPageUrl: string | null;
        currentPage: number;
        firstPageUrl: any;
        lastPageUrl: any;
        total: number;
        perPage: number;
        from: number;
        to: number;
        lastPage: number;
    };
}
const TransactionTable = ({data, hasPagination, metaData, setPageCount, globalFilter}: TransactionTableProps) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedRow, setSelectedRow] = useState<Daum>();

     // Memoize the columns
     const columns = useMemo(() => ColumsTransactionFN(onOpen, setSelectedRow), [onOpen, setSelectedRow]);
     // Memoize the filtered data
     const filterTransactions = useMemo(() => data?.slice(0, 5), [data]);

    const table = useReactTable({
        data: filterTransactions || [],
        columns: columns,
        state: {},
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

  return (
    <div>
      {
        data?.length === 0 
        ? <EmptyOrder 
        heading={globalFilter ? "No Result Found" : `No Transactions Yet`} 
        content={globalFilter ? "No result found for this search" : `You currently have no transaction. All transactions will appear here.`}
        /> : 
        data?.length > 0 ? (
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                <Table>
                    <Thead bg={"#F2F4F7"}>
                    {table?.getHeaderGroups()?.map((headerGroup, i) => (
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
                    {table?.getRowModel()?.rows?.map((row, index) => (
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
                {hasPagination && metaData && (
                    <Pagination {...metaData} setPageCount={setPageCount} />
                )}
            </TableContainer>
        ) : (
            <Flex justify="center" align="center" height="200px">
              <Spinner size="xl" />
            </Flex>
        )}  
        <TransactionDetails 
        isOpen={isOpen} 
        onClose={onClose} 
        type="" 
        selectedRow={selectedRow} 
        />
    </div>
  )
}

export default TransactionTable;