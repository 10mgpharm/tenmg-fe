"use client";

import {
  Button,
  Flex,
  HStack,
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
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import { applicationData } from "@/data/mockdata";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import {
  CustomerRecords,
  LoanApplicationDataResponse,
  NextAuthUserSession,
} from "@/types";
import { ColumsApplicationFN } from "./column";
import SuccessModal from "./SuccessModal";
import { useDebouncedValue } from "@/utils/debounce";
import { IFilterInput } from "@/app/(protected)/vendors/customers-management/page";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import FilterDrawer from "@/app/(protected)/vendors/_components/FilterDrawer";
import EmptyResult from "@/app/(protected)/vendors/_components/EmptyResult";

const DataTable = () => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();
  const {
    isOpen: isOpenSend,
    onOpen: onOpenSend,
    onClose: onCloseSend,
  } = useDisclosure();
  const [pageCount, setPageCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [status, setStatus] = useState<string>("");
  const [loanApplication, setLoanApplication] =
    useState<LoanApplicationDataResponse | null>(null);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchLoanApplication = useCallback(async () => {
    setLoading(true);
    let query = `/admin/loan-application?page=${pageCount}`;

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
  }, [fetchLoanApplication, token]);

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
    { option: "APPROVED", value: "APPROVED" },
    { option: "CANCELED", value: "CANCELED" },
    { option: "PENDING_MANDAT", value: "PENDING_MANDAT" },
  ];

  const table = useReactTable({
    data: tableData ?? [],
    columns: ColumsApplicationFN(),
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
      <HStack justify={"space-between"}>
        <Flex mt={4} gap={2} wrap={"wrap"}>
          <SearchInput
            placeholder="Search for a loan"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <Button
            h={"40px"}
            px={4}
            variant={"outline"}
            className="border text-gray-600 bg-white"
            onClick={onOpenFilter}
          >
            Filter
          </Button>
        </Flex>
      </HStack>

      <div className="mt-5">
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
              <Thead bg={"#F2F4F7"}>
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
            <Pagination meta={tableLinks} setPageCount={setPageCount} />
          </TableContainer>
        )}
      </div>

      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
      />

      <SuccessModal isOpen={isOpenSuccess} onClose={onCloseSuccess} />
    </div>
  );
};

export default DataTable;
