"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchInput from "../components/SearchInput";
import { CiFilter } from "react-icons/ci";
import {
  Button,
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
import requestClient from "@/lib/requestClient";
import {
  NextAuthUserSession,
  TransactionHistoryData,
  TransactionHistoryDataProps,
} from "@/types";
import { useSession } from "next-auth/react";
import EmptyResult from "../components/EmptyResult";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "../../suppliers/components/Pagination";
import { ColumnsTnxHistoryFN } from "./components/table";
import UploadModel from "../components/UploadModel";
import { useDebouncedValue } from "@/utils/debounce";
import { IFilterInput } from "../customers-management/page";
import FilterDrawer from "../components/FilterDrawer";

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [status, setStatus] = useState<string>("");
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [tnxHistoryData, setTnxHistoryData] =
    useState<TransactionHistoryDataProps | null>(null);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const applyFilters = (filters: IFilterInput) => {
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
    { option: "Done", value: "done" },
    { option: "Pending", value: "pending" },
  ];

  const fetchCustomerTnx = useCallback(
    async (page = 1) => {
      setLoading(true);

      let query = `/vendor/txn_history/get-all-txn?page=${page}`;

      if (debouncedSearch) {
        query += `&search=${debouncedSearch}`;
      }
      if (status) {
        query += `&status=${status}`;
      }
      if (createdAtStart) {
        query += `&createdAtStart=${
          createdAtStart.toISOString().split("T")[0]
        }`;
      }
      if (createdAtEnd) {
        query += `&createdAtEnd=${createdAtEnd.toISOString().split("T")[0]}`;
      }

      try {
        const response = await requestClient({ token }).get(query);
        if (response.status === 200) {
          setTnxHistoryData(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [token, debouncedSearch, status, createdAtStart, createdAtEnd]
  );

  useEffect(() => {
    if(!token) return
    fetchCustomerTnx(pageCount);
  }, [fetchCustomerTnx, pageCount, token]);

  const tableData = useMemo(() => tnxHistoryData?.data || [], [tnxHistoryData]);

  const columns = useMemo(() => ColumnsTnxHistoryFN(), []);

  const table = useReactTable({
    data: tableData ? tableData : [],
    columns,
    state: {
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const customerNames = useMemo(() => {
    if (tableData.length > 0) {
      const names = tableData.map((item) => item.customer?.name);
      return Array.from(new Set(names));
    }
    return [];
  }, [tableData]);

  const tablePagination = useMemo(() => tnxHistoryData?.meta || [], [tnxHistoryData]);

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Transaction Evaluations</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <SearchInput
              placeholder="Search for a transaction"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <div
              onClick={onOpenFilter}
              className="border cursor-pointer border-gray-300 p-3 rounded-md flex items-center gap-2"
            >
              <CiFilter className="w-5 h-5" />
              <p className="text-gray-500 font-medium">Filter</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={onOpen}>Evaluate Transaction History</Button>
        </div>
      </div>
      <div>
        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : tableData.length === 0 ? (
          <EmptyResult
            heading="Nothing to show here yet"
            content="You don’t have any transaction history yet. When you do, they’ll appear here."
          />
        ) : (
          <TableContainer border="1px solid #F9FAFB" borderRadius="10px">
            <Table>
              <Thead bg="blue.50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        textTransform="initial"
                        px="0px"
                        key={header.id}
                        color="primary.500"
                        fontWeight="500"
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
              <Tbody bg="white" color="#606060" fontSize="14px">
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
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
                  <Td py={4} w="full" colSpan={columns.length}>
                    <Pagination
                      meta={tablePagination}
                      setPageCount={setPageCount}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </div>

      <UploadModel
        isOpen={isOpen}
        onClose={onClose}
        isDownloadTemplate={false}
        uploadEndpoint="/vendor/txn_history/upload_and_evaluate"
        isSearch
        searchTitle="Customer by Name or ID"
        searchData={customerNames}
      />
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

export default TransactionHistory;
