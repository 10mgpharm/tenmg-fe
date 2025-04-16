"use client";

import { useEffect, useState } from "react"
import { CiFilter } from "react-icons/ci";
import SearchInput from "../../_components/SearchInput"
import { Flex, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import EmptyResult from "../../_components/EmptyResult"
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { AuditLogData } from "@/data/mockdata";
import { ColumnsAuditLogFN } from "./table";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";


const ActivityLogs = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;

    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [data, setData] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [pagination_link, setPagination_link] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(1);

    const ITEMS_PER_PAGE = 10;

    console.log("pagination_link", pagination_link)

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    useEffect(() => {
        const fetchData = async (page: number) => {
            setLoading(true);
            setError("");

            //audit-logs?event=login
            const url = searchValue ? `vendor/audit-logs?event=${searchValue}&page=${page}&limit=${ITEMS_PER_PAGE}` : `vendor/audit-logs?page=${page}&limit=${ITEMS_PER_PAGE}`;

            try {
                const response = await requestClient({ token }).get(url);

                if (response.status === 200 && response.data.data) {
                    console.log(response.data.data);
                    setData(response.data.data.data || []);
                    setPagination_link(response.data.data || []);
                    setTotalItems(response.data.data.total || 0);
                } else {
                    setError("Failed to load audit logs. Please try again.");
                }
            } catch (err: any) {
                console.error(err);
                setError("An unexpected error occurred while fetching audit logs.");
            } finally {
                setLoading(false);
            }
        };


        if (token) {
            fetchData(currentPage);
        }
    }, [token, currentPage, searchValue]);

    const meta = {
        links: pagination_link
    }

    const table = useReactTable({
        data,
        columns: ColumnsAuditLogFN(),
        state: {
            globalFilter,
        },
        manualFiltering: true,
        // onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div>
            <div className="mb-5 mt-3">
                <div className="flex items-center gap-3">
                    <SearchInput
                        placeholder="Search by action"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
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
                {!loading && !error && data.length > 0 && (
                    <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"} >
                        <Table>
                            <Thead bg={"#F2F4F7"}>
                                {table?.getHeaderGroups()?.map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers?.map((header) => (
                                            <Th textTransform={"initial"} px="16px" key={header.id}>
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
                            <Tbody bg={"white"} color="#606060" fontSize={"14px"} >
                                {table?.getRowModel()?.rows?.map((row) => (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells()?.map((cell) => (
                                            <Td key={cell.id} px="16px">
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
                            meta={pagination_link}
                            setPageCount={setPageCount}
                        />
                    </TableContainer>
                )}
            </div>
        </div>
    )
}

export default ActivityLogs