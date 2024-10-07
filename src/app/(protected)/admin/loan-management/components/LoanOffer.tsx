"use client";
import SearchComponent from "@/app/(protected)/suppliers/orders/components/SearchComponent"
import { 
    Button,
    Flex, 
    HStack,
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Text, 
    Th,
    Thead, 
    Tr 
} from "@chakra-ui/react"
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import { useState } from "react";
import { ColumsApplicationFN } from "./applicationTable";
import EmptyOrder from "@/app/(protected)/suppliers/orders/components/EmptyOrder";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Pagination from "@/app/(protected)/suppliers/components/Pagination";
import { applicationData } from "@/data/mockdata";

const LoanOffer = () => {

    const onOpen = () => {}
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // const memoizedData = useMemo(() => data, [data]);

    const table = useReactTable({
        data: applicationData,
        columns: ColumsApplicationFN(onOpen),
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
        <Flex mt={4} gap={2}>
            <SearchComponent placeholder='Search for a user'/>
            <Button 
            h={"40px"} 
            px={4} 
            variant={"outline"} 
            className="border text-gray-600 bg-white">
                Filter
            </Button>
        </Flex>
        <div className="mt-5">
        {
            applicationData?.length === 0 
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
                        applicationData?.length > 10 ? <Pagination />
                        :  <span className="bg-primary-50 py-2 px-4 rounded-md text-primary-600 cursor-pointer">1</span>
                    }
                    <Flex alignItems={"center"} gap={2}>
                        <Text className='text-gray-500'>Next</Text>
                        <FaChevronRight className='text-gray-500' />
                    </Flex>
                </HStack>
            </TableContainer>
        }
        </div>
    </div>
  )
}

export default LoanOffer;