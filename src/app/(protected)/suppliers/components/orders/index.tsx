import Link from 'next/link'
import React, { useState } from 'react'
import { ColumsFN } from './table';
import { ColumnOrderState, RowSelectionState, SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

const data = [
    {id: "#3066", customer: "Olivia Rhye", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Pending", total: "#2,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3065", customer: "Phoenix Baker", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Cancelled", total: "#6,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3067", customer: "Lana Steiner", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Completed", total: "#9,000", address: "42 Deji Olamiju Street, Gbagada"},
]
const Orders = () => {

    const onOpen = () => {}

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // const memoizedData = useMemo(() => data, [data]);

    const table = useReactTable({
        data: data,
        columns: ColumsFN(onOpen),
        onSortingChange: setSorting,
        state: {
          sorting,
          columnVisibility,
          columnOrder,
          rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
  return (
    <div className='bg-white p-5 rounded-md'>
        <div className="flex items-center justify-between mb-5">
            <h3 className='text-gray-600 font-semibold text-xl'>Orders</h3>
            <Link href={'#'} className='border p-2 rounded-md'> 
                <span className='text-gray-500 px-4'>View all</span>
            </Link>
        </div>
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
                <Tbody color="#606060" fontSize={"14px"}>
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

            {/* {memoizedData?.length < 1 && (
                <Flex style={lottieRoot} flexDir="column" py="50px">
                <Lottie
                    animationData={
                    offerDataFetching ? loadingJson : emptyState
                    }
                    loop={false}
                    style={{ height: offerDataFetching ? 30 : 400 }}
                    width={300}
                />
                </Flex>
            )} */}
        </TableContainer>
    </div>
  )
}

export default Orders