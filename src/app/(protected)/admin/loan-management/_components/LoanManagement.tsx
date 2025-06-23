"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import SearchComponent from "@/app/(protected)/suppliers/orders/_components/SearchComponent";
import { ColumsLoanFN } from "./table";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import { LoanDataProp, NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import { formatAmount } from "@/utils/formatAmount";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import FilterDrawer from "@/app/(protected)/vendors/_components/FilterDrawer";
import { IFilterInput } from "@/app/(protected)/vendors/customers-management/page";
import { formatAmountString, handleServerErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import WalletOverview from "../../wallet/_components/WalletOverview";

const LoanManagement = () => {
  const onOpen = () => {};

  const [pageCount, setPageCount] = useState<number>(1);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const [loan, setLoan] = useState<LoanDataProp | null>(null);

  const [loanStats, setLoanStats] = useState<any | null>(null);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    let query = `/admin/loan?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }
    if (status) {
      query += `&status=${status}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setLoan(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [token, pageCount, debouncedSearch, status]);

  const fetchLoanStats = useCallback(async () => {
    setLoading(true);

    try {
      const response = await requestClient({ token: token }).get(
        `/admin/loan/stats`
      );
      if (response.status === 200) {
        setLoanStats(response?.data?.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token]);

  const sendRepaymentLink = useCallback(
    async (id: string) => {
      try {
        const response = await requestClient({ token: token }).get(
          `/admin/loan-repayment/test-repayment-mail/${id}`
        );
        if (response.status === 200) {
          toast.success("Repayment link sent successfully");
        }
      } catch (error) {
        const errorMessage = handleServerErrorMessage(error);
        console.error(errorMessage);
        toast.error(errorMessage);
      }
    },
    [token]
  );

  const tableData = useMemo(() => loan?.data, [loan?.data]);

  useEffect(() => {
    if (!token) return;
    fetchLoans();
    fetchLoanStats();
  }, [fetchLoans, fetchLoanStats, token]);

  const table = useReactTable({
    data: tableData || [],
    columns: ColumsLoanFN(onOpen, sendRepaymentLink, pageCount),
    state: {
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

  const applyFilters = (filters: IFilterInput) => {
    setStatus(filters.status);
  };

  const clearFilters = () => {
    setStatus("");
    setGlobalFilter("");
  };

  const filterOptions = [
    { option: "APPROVED", value: "APPROVED" },
    { option: "INITIATED", value: "INITIATED" },
    { option: "ONGOING", value: "ONGOING" },
  ];

  return (
    <>
      <div className="">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 ">
          <WalletOverview
            title="Total Loan Amount"
            value={
              loanStats
                ? `₦${String(formatAmountString(loanStats?.totalLoans))}`
                : "₦0"
            }
            fromColor="from-[#53389E]"
            toColor="to-[#7F56D9]"
            image={totalPattern}
            hasPendingBalance={false}
            pendingBalance={"0.00"}
          />
          <WalletOverview
            title="Total Interest"
            value={
              loanStats
                ? `₦${String(formatAmountString(loanStats?.totalInterest))}`
                : "₦0"
            }
            fromColor="from-[#DC6803]"
            toColor="to-[#DC6803]"
            image={orderPattern}
            hasPendingBalance={false}
          />
          <WalletOverview
            title="Active Loans"
            value={loanStats ? loanStats?.activeLoan : 0}
            fromColor="from-[#3E4784]"
            toColor="to-[#3E4784]"
            image={productPattern}
            hasPendingBalance={false}
          />
          <WalletOverview
            title="Pending Repayment"
            value={
              loanStats
                ? `₦${String(formatAmountString(loanStats?.pendingRepayment))}`
                : "₦0"
            }
            fromColor="from-[#E31B54]"
            toColor="to-[#E31B54]"
            image={productPattern}
            hasPendingBalance={false}
          />
        </div>
        <Flex mt={4} gap={2}>
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
        <div className="mt-5">
          {loading ? (
            <Flex justify="center" align="center" height="200px">
              <Spinner size="xl" />
            </Flex>
          ) : tableData?.length === 0 ? (
            <EmptyOrder
              heading={`No Loan Yet`}
              content={`You currently have no loan application. All loan will appear here.`}
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
              <Pagination meta={loan?.meta} setPageCount={setPageCount} />
            </TableContainer>
          )}
        </div>
      </div>

      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
        isNotDate
      />
    </>
  );
};

export default LoanManagement;
