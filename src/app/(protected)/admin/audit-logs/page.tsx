"use client";
import { useState } from "react";
import { LogsData } from "@/data/mockdata"
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import SearchComponent from "../../suppliers/orders/components/SearchComponent"
import EmptyOrder from "../../suppliers/orders/components/EmptyOrder"
import { 
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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import Pagination from "../../suppliers/_components/Pagination"
import { ColumsLogFN } from "./components/table";

const Page = () => {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // const memoizedData = useMemo(() => data, [data]);

    const table = useReactTable({
        data: LogsData,
        columns: ColumsLogFN(),
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
    <div className="p-8">
        <h2 className='text-2xl font-semibold text-gray-700 mb-2'>Audit Logs</h2>
        <SearchComponent placeholder="Search" />
        <div className="mt-5">
        {
            LogsData?.length === 0 
            ? <EmptyOrder 
            heading={`No Audit Loags Yet`} 
            content={`You currently have no audit logs. All audit logs will appear here.`} 
            /> : 
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

export default Page