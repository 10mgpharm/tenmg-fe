"use client";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import { CiFilter } from "react-icons/ci";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LoanByUser } from "@/data/mockdata";
import { ColumnsLoanFN } from "./_components/table";
import {
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import EmptyResult from "../_components/EmptyResult";
import OverviewCards from "../../_components/loanApplication/OverviewCards";
import SearchFilter from "../../_components/loanApplication/SearchFilter";
import LoanTable from "../../_components/loanApplication/LoanTable";
import requestClient from "@/lib/requestClient";
import { useDebouncedValue } from "@/utils/debounce";
import { LoanDataProp, NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import { formatAmount } from "@/utils/formatAmount";
import FilterDrawer from "../_components/FilterDrawer";
import { IFilterInput } from "../customers-management/page";
import { Button, Flex, HStack, useDisclosure } from "@chakra-ui/react";
import SearchInput from "../_components/SearchInput";
import { formatDateRange } from "@/lib/dateFormatter";
import { IApplyFilters } from "../loan-applications/page";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

export interface OverviewCardData {
  title: string;
  value: string;
  fromColor?: string;
  toColor?: string;
  image: any;
}

const LoanManagement = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [loan, setLoan] = useState<LoanDataProp | null>(null);

  const [loanStats, setLoanStats] = useState<any | null>(null);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    let query = `/vendor/loans?page=${pageCount}`;

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
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch, status]);

  const fetchLoanStats = useCallback(async () => {
    setLoading(true);

    try {
      const response = await requestClient({ token: token }).get(
        `/vendor/loans/view/stats`
      );
      if (response.status === 200) {
        setLoanStats(response.data.data);
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
          `/vendor/repayment/test-repayment-mail/${id}`
        );
        if (response.status === 200) {
          toast.success("Repayment link sent successfully");
        }
      } catch (error) {
        console.error(error);
        const errorMessage = handleServerErrorMessage(error);
        toast.error(errorMessage);
      }
    },
    [token]
  );

  const applyFilters = (filters: IApplyFilters) => {
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

  const tableData = useMemo(() => loan?.data, [loan?.data]);

  useEffect(() => {
    if (!token) return;
    fetchLoans();
    fetchLoanStats();
  }, [fetchLoans, fetchLoanStats, token]);

  const overviewData: OverviewCardData[] = [
    {
      title: "Active Loan",
      value: loanStats ? loanStats?.activeLoan : 0,
      fromColor: "from-[#53389E]",
      toColor: "to-[#7F56D9]",
      image: totalPattern,
    },
    {
      title: "Total Loan Amount",
      value: loanStats ? formatAmount(loanStats?.totalLoans) : "₦0",
      fromColor: "from-[#DC6803]",
      toColor: "to-[#DC6803]",
      image: orderPattern,
    },
    {
      title: "Pending Repayment",
      value: loanStats ? formatAmount(loanStats?.pendingRepayment) : "₦0",
      fromColor: "from-[#3E4784]",
      toColor: "to-[#3E4784]",
      image: productPattern,
    },
    {
      title: "Completed Loan",
      value: loanStats ? loanStats?.completedRepayment : 0,
      fromColor: "from-[#E31B54]",
      toColor: "to-[#E31B54]",
      image: productPattern,
    },
  ];

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Loan Management</h3>
      <div className="grid grid-cols-2  lg:grid-cols-4 gap-4 mt-5">
        <OverviewCards overviewData={overviewData} />
      </div>
      <HStack justify={"space-between"} flexWrap={"wrap"}>
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
        <LoanTable
          data={tableData ?? []}
          columns={ColumnsLoanFN(sendRepaymentLink)}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          loading={loading}
          setPageCount={setPageCount}
          metaData={loan?.meta}
        />
      </div>

      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
        isNotDate
      />
    </div>
  );
};

export default LoanManagement;
