"use client";
import {
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { CiFilter, CiMenuKebab } from "react-icons/ci";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import SearchInput from "../../vendors/_components/SearchInput";
import { LoanByUser } from "@/data/mockdata";
import Pagination from "../_components/Pagination";
import OverviewCards from "../../_components/loanApplication/OverviewCards";
import SearchFilter from "../../_components/loanApplication/SearchFilter";
import LoanTable from "../../_components/loanApplication/LoanTable";
import { ColumnsLoanFN } from "./_components/table";
export default function LoanApplicationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data: LoanByUser ?? [],
    columns: ColumnsLoanFN(),
    state: {
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="m-5">
      <h3 className="font-semibold text-xl my-4">Loan Application</h3>

      <OverviewCards />
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
}

{
  /* <Badge colorScheme='green'>Success</Badge>
  <Badge colorScheme='red'>Removed</Badge>
  <Badge colorScheme='purple'>New</Badge> */
}

export const table_data = [
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
  {
    id: "10MG-001 - 2024",
    date: "Aug 21, 2024",
    borrower_name: "Medlife Hospital",
    vendor: "HealPro Inc.",
    amount: "₦1, 250,000",
    creditScore: "720(Good)",
    status: "Pending",
  },
];
