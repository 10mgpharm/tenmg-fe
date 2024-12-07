"use client";
import SearchComponent from "@/app/(protected)/suppliers/orders/_components/SearchComponent"
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
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
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
            ? <EmptyOrder heading={`No Loan Offer Yet`} content={`You currently have no loan offer. All loan offers will appear here.`}/> : 
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
               {/* <Pagination /> */}
            </TableContainer>
        }
        </div>
    </div>
  )
}

export default LoanOffer;