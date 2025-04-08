"use client";
import { CiFilter } from "react-icons/ci";
import SearchInput from "../_components/SearchInput";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyResult from "../_components/EmptyResult";
import { useSession } from "next-auth/react";
import {
  CustomerRecords,
  LoanApplicationDataResponse,
  NextAuthUserSession,
} from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import CreateLoan from "./_components/CreateLoan";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "../../suppliers/_components/Pagination";
import { ColumnsLoanApplicationFN } from "./_components/table";
import { IFilterInput } from "../customers-management/page";
import FilterDrawer from "../_components/FilterDrawer";
import SendApplicationLink from "./_components/SendApplicationLink";

export interface OverviewCardData {
  title: string;
  value: string | number;
  fromColor?: string;
  toColor?: string;
  image: any;
}

const LoanApplication = () => {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [loanApplication, setLoanApplication] =
    useState<LoanApplicationDataResponse | null>(null);
  const [allCustomers, setAllCustomers] = useState<CustomerRecords[]>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();
  const {
    isOpen: isOpenSend,
    onClose: onCloseSend,
    onOpen: onOpenSend,
  } = useDisclosure();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [pageCount, setPageCount] = useState<number>(1);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchLoanApplication = useCallback(async () => {
    setLoading(true);
    let query = `/vendor/loan-applications?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }
    if (status) {
      query += `&status=${status}`;
    }
    if (createdAtStart) {
      query += `&dateFrom=${createdAtStart.toISOString().split("T")[0]}`;
    }
    if (createdAtEnd) {
      query += `&dateTo=${createdAtEnd.toISOString().split("T")[0]}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setLoanApplication(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch, status, createdAtStart, createdAtEnd]);

  const fetchAllCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        "/vendor/customers/get-all"
      );
      if (response.status === 200) {
        setAllCustomers(response.data.data);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token]);

  const tableLinks = useMemo(
    () => loanApplication?.links,
    [loanApplication?.links]
  );
  const tableData = useMemo(
    () => loanApplication?.data,
    [loanApplication?.data]
  );

  useEffect(() => {
    if (!token) return;
    fetchLoanApplication();
    fetchAllCustomers();
  }, [fetchLoanApplication, fetchAllCustomers, token]);

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

  const table = useReactTable({
    data: tableData ?? [],
    columns: ColumnsLoanApplicationFN(),
    state: {
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filterOptions = [
    { option: "APPROVED", value: "APPROVED" },
    { option: "INITIATED", value: "INITIATED" },
    { option: "EXPIRED", value: "EXPIRED" },
  ];

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Loan Application</h3>

      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <SearchInput
              placeholder="Search for a loan"
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
        <div className="flex items-center gap-4">
          {/* <Button onClick={onOpen} variant={"outline"}>
            Create Application
          </Button> */}
          <Button onClick={onOpenSend}>Send Application Link</Button>
        </div>
      </div>

      <div className="">
        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : tableData && tableData?.length === 0 ? (
          <EmptyResult
            heading={`Nothing to show here yet`}
            content={`No active loans yet. Once you've disbursed a loan, the details will appear here.`}
          />
        ) : (
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
            <Table>
              <Thead bg={"blue.50"}>
                {tableData &&
                  table?.getHeaderGroups()?.map((headerGroup) => (
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
                {tableData?.length &&
                  table?.getRowModel()?.rows?.map((row) => (
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
            <Pagination meta={tableLinks} setPageCount={setPageCount} />
          </TableContainer>
        )}
      </div>
      <CreateLoan
        isOpen={isOpen}
        onClose={onClose}
        customers={allCustomers}
        fetchLoanApplication={fetchLoanApplication}
      />
      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
      />
      <SendApplicationLink
        isOpen={isOpenSend}
        onClose={onCloseSend}
        customers={allCustomers}
        fetchLoanApplication={fetchLoanApplication}
      />
    </div>
  );
};

export default LoanApplication;
