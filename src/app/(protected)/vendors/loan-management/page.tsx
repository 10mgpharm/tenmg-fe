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

export interface OverviewCardData {
  title: string;
  value: string;
  fromColor?: string;
  toColor?: string;
  image: any;
}

// TODO: Add this to types

const LoanManagement = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [loan, setLoan] = useState<LoanDataProp | null>(null);

  const [loanStats, setLoanStats] = useState<any | null>(null);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    let query = `/vendor/loans?page=${pageCount}`;

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
        setLoan(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch, status, createdAtStart, createdAtEnd]);

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
      <div className="grid grid-cols-4 gap-4 mt-5">
        <OverviewCards overviewData={overviewData} />
      </div>
      <SearchFilter
        value={globalFilter}
        onSearchChange={(e) => setGlobalFilter(e.target.value)}
        // You can pass an onFilterClick handler if needed
      />
      <div className="mt-5">
        <LoanTable
          data={tableData ?? []}
          columns={ColumnsLoanFN()}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LoanManagement;
