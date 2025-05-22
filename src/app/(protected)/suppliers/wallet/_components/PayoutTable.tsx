"use client";
import React, { Dispatch, SetStateAction } from 'react'

import { 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import EmptyOrder from '../../orders/_components/EmptyOrder';
import { Table,TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { ColumsPayoutFN } from './tablePayout';
import { PayoutTypeProps } from '@/types';
import Pagination from '@/app/(protected)/admin/products/_components/Pagination';
import TransactionDetails from '@/app/(protected)/admin/wallet/_components/TransactionDetail';

interface PayoutTableProps {
    data: PayoutTypeProps[];
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

const PayoutTable = ({data, hasPagination, metaData, setPageCount}: PayoutTableProps) => {

    console.log(data)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedRow, setSelectedRow] = useState<any>();

    const columns = useMemo(() => ColumsPayoutFN(onOpen, setSelectedRow), [onOpen, setSelectedRow]);
    
    // Memoize the filtered data
    const filterTransactions = useMemo(() => {
        if (!data) return [];
        return hasPagination ? data : data.slice(0, 6);
    }, [data, hasPagination]);

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
            heading={`No Transactions Yet`} 
            content={`You currently have no transaction. All transactions will appear here.`} 
            /> : 
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
        }  
        <TransactionDetails
            isOpen={isOpen}
            onClose={onClose}
            selectedRow={selectedRow}
            type='sup_payout'
        />
    </div>
  )
}

export default PayoutTable