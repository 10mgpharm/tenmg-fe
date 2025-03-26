"use client";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import OverviewCard from "../../suppliers/_components/OverviewCard/OverviewCard";
import SearchInput from "../_components/SearchInput";
import { CiFilter } from "react-icons/ci";
import { useState } from "react";
import { LoanByUser } from "@/data/mockdata";
import { ColumnsLoanFN } from "./_components/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
} from "@chakra-ui/react";
import EmptyResult from "../_components/EmptyResult";
import OverviewCards from "../../_components/loanApplication/OverviewCards";
import SearchFilter from "../../_components/loanApplication/SearchFilter";
import LoanTable from "../../_components/loanApplication/LoanTable";

export interface OverviewCardData {
  title: string;
  value: string;
  fromColor?: string;
  toColor?: string;
  image: any;
}

// TODO: Add this to types

const overviewData: OverviewCardData[] = [
  {
    title: "Total Loans",
    value: "5,600",
    fromColor: "from-[#53389E]",
    toColor: "to-[#7F56D9]",
    image: totalPattern,
  },
  {
    title: "Total Interests",
    value: "₦2,300",
    fromColor: "from-[#DC6803]",
    toColor: "to-[#DC6803]",
    image: orderPattern,
  },
  {
    title: "Total Amount Disbursed",
    value: "₦50,000",
    fromColor: "from-[#3E4784]",
    toColor: "to-[#3E4784]",
    image: productPattern,
  },
  {
    title: "Total Products",
    value: "50,000",
    fromColor: "from-[#E31B54]",
    toColor: "to-[#E31B54]",
    image: productPattern,
  },
];

const LoanManagement = () => {
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

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
          data={LoanByUser ?? []}
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
