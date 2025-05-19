"use client";

import { useCallback, useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import SearchInput from "../../_components/SearchInput";
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
  useDisclosure,
} from "@chakra-ui/react";
import EmptyResult from "../../_components/EmptyResult";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { APILogData } from "@/data/mockdata";
import { ColumnsApiLogFN } from "./apiLogTable";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import FilterDrawer from "../../_components/FilterDrawer";
import { IApplyFilters } from "../../loan-applications/page";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";

const ApiLogs = () => {
  const [apiLogData, setApiLogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const [pageCount, setPageCount] = useState<number>(1);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [status, setStatus] = useState(null);

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchApiLogData = useCallback(async () => {
    setLoading(true);
    let query = `/vendor/api-logs?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }
    if (status) {
      query += `&status=${status}`;
    }
    if (createdAtStart) {
      query += `&dateFrom=${createdAtStart}`;
    }
    if (createdAtEnd) {
      query += `&dateTo=${createdAtEnd}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setApiLogData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch, status, createdAtStart, createdAtEnd]);

  useEffect(() => {
    if (!token) return;
    fetchApiLogData();
  }, [token, fetchApiLogData]);

  const applyFilters = (filters: IApplyFilters) => {
    setCreatedAtStart(filters.startDate);
    setCreatedAtEnd(filters.endDate);
    setStatus(filters.status);
  };

  const clearFilters = () => {
    setCreatedAtStart(null);
    setCreatedAtEnd(null);
    setStatus("");
    setGlobalFilter("");
  };

  const filterOptions = [
    { option: "Successful", value: "Successful" },
    { option: "Failed", value: "Failed" },
  ];

  const table = useReactTable({
    data: apiLogData?.data ?? [],
    columns: ColumnsApiLogFN(),
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
            onClick={onOpenFilter}
            className="border cursor-pointer border-gray-300 p-2 rounded-md flex items-center gap-2"
          >
            <CiFilter className="w-5 h-5" />
            <p className="text-gray-500 font-medium">Filter</p>
          </div>
        </div>
      </div>
      <div className="">
        {!loading ? (
          apiLogData?.data?.length !== 0 ? (
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
                    <Td py={4} w="full" colSpan={7}>
                      <Pagination
                        meta={apiLogData?.meta}
                        setPageCount={setPageCount}
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyResult
              heading={`No Results Found`}
              content={`We couldn’t find anything that matches "${debouncedSearch}". Try different keywords or check your spelling.`}
            />
          )
        ) : (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )}
      </div>

      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default ApiLogs;
