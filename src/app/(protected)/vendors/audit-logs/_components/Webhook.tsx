"use client";

import { useState } from "react"
import { CiFilter } from "react-icons/ci";
import SearchInput from "../../_components/SearchInput"
import { Flex, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import EmptyResult from "../../_components/EmptyResult"
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { WebhookLogData } from "@/data/mockdata";
import { ColumnsWebhookLogFN } from "./webhookTable";

const Webhook = () => {

    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string>("");

    const table = useReactTable({
        data: WebhookLogData ?? [],
        columns: ColumnsWebhookLogFN(),
        state: {
          globalFilter,
        },
        manualFiltering: true,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
    
    return (
    <div>
        <div className="mb-5 mt-3">
            <div className="flex items-center gap-3">
                <SearchInput
                placeholder="Search"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <div
                // onClick={onOpenFilter}
                className="border cursor-pointer border-gray-300 p-2 rounded-md flex items-center gap-2"
                >
                <CiFilter className="w-5 h-5" />
                <p className="text-gray-500 font-medium">Filter</p>
                </div>
            </div>
        </div>
        <div className="">
            {!loading ? (
            WebhookLogData?.length !== 0 ? (
                <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                <Table>
                    <Thead bg={"blue.50"}>
                    {table?.getHeaderGroups()?.map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                        {headerGroup.headers?.map((header) => (
                            <Th
                            textTransform={"initial"}
                            px="0px"
                            key={header.id}
                            color={"primary.500"}
                            fontWeight={"500"}
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
                        <Tr>
                        {/* <Td py={4} w="full" colSpan={7}>
                        <Pagination
                            meta={tablePagination}
                            setPageCount={setPageCount}
                        />
                        </Td> */}
                    </Tr>
                    </Tbody>
                </Table>
                </TableContainer>
            ) : (
                <EmptyResult heading={`Nothing to show here`} content={``} />
            )
            ) : (
            <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
            </Flex>
            )}
        </div>
    </div>
  )
}

export default Webhook