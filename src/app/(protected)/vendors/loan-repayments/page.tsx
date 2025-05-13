"use client";

import { CiFilter } from "react-icons/ci";
import SearchInput from "../_components/SearchInput";
import { useCallback, useEffect, useState } from "react";
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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EmptyResult from "../_components/EmptyResult";
import { ColumnsLoanRepaymentFN } from "./_components/table";
import { LoanDataProp, NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import { useDebouncedValue } from "@/utils/debounce";
import FilterDrawer from "../_components/FilterDrawer";
import { IApplyFilters } from "../loan-applications/page";
import Pagination from "../../suppliers/_components/Pagination";

const LoanRepayments = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LoanDataProp>();
  const [pageCount, setPageCount] = useState<number>(1);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [status, setStatus] = useState("");
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchingLoans = useCallback(async () => {
    setLoading(true);
    let query = `/vendor/loan-repayment?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
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
        setData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch, createdAtEnd, createdAtStart]);

  useEffect(() => {
    if (!token) return;
    fetchingLoans();
  }, [token, fetchingLoans]);

  const table = useReactTable({
    data: data ? data.data : [],
    columns: ColumnsLoanRepaymentFN(pageCount),
    state: {
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const applyFilters = (filters: IApplyFilters) => {
    setCreatedAtStart(filters.startDate);
    setCreatedAtEnd(filters.endDate);
    setStatus(filters.status);
  };

  const clearFilters = () => {
    setCreatedAtStart(null);
    setCreatedAtEnd(null);
    setStatus("");
  };

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Loan Repayment</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5 ">
            <SearchInput
              placeholder="Search by customer name"
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
      </div>
      <div className="w-full">
        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : data && data.data?.length === 0 ? (
          <EmptyResult
            heading={`Nothing to show here yet`}
            content={`No active loans repayment yet. Once you've a repaid loan, the details will appear here.`}
          />
        ) : (
          <TableContainer
            border="1px solid #F9FAFB"
            borderRadius="10px"
            overflowX="auto"
            w="100%"
          >
            <Table>
              <Thead bg={"blue.50"}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers?.map((header) => (
                      <Th textTransform={"initial"} px="0px" key={header.id}>
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

            <Pagination meta={data?.meta} setPageCount={setPageCount} />
          </TableContainer>
        )}
      </div>

      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        noStatus
        title="Filter by due date"
      />
    </div>
  );
};

export default LoanRepayments;
