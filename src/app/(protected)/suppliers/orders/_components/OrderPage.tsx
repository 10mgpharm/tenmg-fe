"use client";
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import { 
    Flex, 
    Spinner, 
    Table, 
    TableContainer, 
    Tbody, 
    Td,  
    Th, 
    Thead, 
    Tr,  
} from '@chakra-ui/react';
import { ColumsOrderFN } from './table';
import { OrderResponseData } from '@/types';
import Pagination from '@/app/(protected)/suppliers/_components/Pagination';
import EmptyOrder from '@/app/(protected)/suppliers/orders/_components/EmptyOrder';

interface OrderPageProp {
    orders: OrderResponseData;
    type: string;
    fetchOrders: () => void;
    loading: boolean;
    pageCount: number;
    globalFilter: string;
    setPageCount: Dispatch<SetStateAction<number>>
}

const OrderPage = ({orders, type, loading, pageCount, setPageCount, globalFilter}: OrderPageProp) => {

    const [sorting, setSorting] = useState<SortingState>([]);
    const memoizedData = useMemo(() => orders?.data, [orders?.data]);

    const table = useReactTable({
        data: memoizedData,
        columns: ColumsOrderFN(
            pageCount, 
            20,
        ),
        onSortingChange: setSorting,
        state: {
          globalFilter
        },
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
    <div>
        {
            loading ? 
                <Flex justify="center" align="center" height="200px">
                    <Spinner size="xl" />
                </Flex>: 
            memoizedData?.length === 0 
            ? <EmptyOrder 
            heading={`No ${type} Order Yet`} 
            content={`You currently have no ${type} orders. All ${type} orders will appear here.`} 
            /> : memoizedData?.length > 0 && (
                <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                    <Table>
                        <Thead bg={"#F2F4F7"}>
                        {table?.getHeaderGroups()?.map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                            {headerGroup.headers?.map((header) => (
                                <Th
                                textTransform={"initial"}
                                px="0px"
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
                        {table?.getRowModel()?.rows?.map((row) => (
                            <Tr key={row.id}>
                            {row.getVisibleCells()?.map((cell) => (
                                <Td key={cell.id} px="0px">
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
                    <Pagination 
                    meta={orders?.meta}
                    setPageCount={setPageCount}
                    />
                </TableContainer>
            )
        }
    </div>
  )
}

export default OrderPage