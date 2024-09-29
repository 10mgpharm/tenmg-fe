"use client";
import { useState } from 'react'
import EmptyOrder from './EmptyOrder'
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import { ColumsOrderFN } from './table';
import { Flex, HStack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const AllOrders = ({data, type}: {data: any, type: string}) => {

    const onOpen = () => {}
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // const memoizedData = useMemo(() => data, [data]);

    const table = useReactTable({
        data: data,
        columns: ColumsOrderFN(onOpen),
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
    <div>
        {
            data?.length === 0 
            ? <EmptyOrder /> : 
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
                <HStack mt={5} justify={"space-between"}>
                    <Flex alignItems={"center"} gap={2}>
                        <FaChevronLeft className='text-gray-500' />
                        <Text className='text-gray-500'>Prev</Text>
                    </Flex>
                    {
                        data?.length > 10 ? <Pagination />
                        :  <span className="bg-primary-50 py-2 px-4 rounded-md text-primary-600 cursor-pointer">1</span>
                    }
                    {/* <Pagination /> */}
                    <Flex alignItems={"center"} gap={2}>
                        <Text className='text-gray-500'>Next</Text>
                        <FaChevronRight className='text-gray-500' />
                    </Flex>
                </HStack>
            </TableContainer>
        }
    </div>
  )
}

export default AllOrders