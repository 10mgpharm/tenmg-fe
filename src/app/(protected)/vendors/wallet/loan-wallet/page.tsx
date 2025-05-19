"use client";

import React, { useCallback, useEffect, useState } from "react";
import TimeLineSelector from "../_components/TimeLineSelector";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { transactionData } from "@/data/mockdata";
import DataTable from "../_components/table";
import TransactionDetails from "../_components/transactionDetails";
import InitiatePayout from "../_components/initiate_payout";

import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import SearchInput from "../../_components/SearchInput";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { Awaiting_column } from "../_components/colunms/awaiting_column";
import { useDebouncedValue } from "@/utils/debounce";
import { IApplyFilters } from "../../loan-applications/page";
import FilterDrawer from "../../_components/FilterDrawer";

const LoanWallet = () => {
  // const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openPayout, setOpenPayout] = React.useState(false);
  const [openCompleted, setOpenCompleted] = React.useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [pageCount, setPageCount] = useState(1);
  const [transactions, setTransactions] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [status, setStatus] = useState("");

  const [selectedTransactionDetails, setSelectedTransactionDetails] =
    useState<any>(null);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const debouncedSearch = useDebouncedValue(searchValue, 500);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    let query = `/vendor/wallet/transactions?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }

    if (status) {
      query += `&search=${status}`;
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
        setTransactions(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch, createdAtEnd, createdAtStart, status]);

  useEffect(() => {
    token && fetchTransactions();
  }, [token, fetchTransactions]);

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
    <div className="px-6 py-8 md:p-8">
      <Link
        href={"/vendors/wallet"}
        className="flex items-center gap-2 tetx-[15px] hover:text-gray-800 pb-2 text-primary-600 w-fit"
      >
        <ArrowLeft size={20} />
        Back
      </Link>

      <h2 className="text-[18px] font-bold">Loan Wallet</h2>
      <div className="flex items-center justify-between mt-3 mb-4 ">
        <SearchInput
          placeholder="Search by customer name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <Button variant={"outline"} onClick={onOpenFilter}>
          Filter{" "}
        </Button>
      </div>

      <DataTable
        data={transactions?.data}
        column={Awaiting_column(
          setOpenDetails,
          setOpenPayout,
          setOpenCompleted,
          setSelectedTransactionDetails
        )}
        hasPagination={true}
        isLoading={loading}
        metaData={transactions?.meta}
        setPageCount={setPageCount}
      />

      {/* Side sheets */}
      {openDetails && (
        <TransactionDetails
          isOpen={openDetails}
          onClose={() => setOpenDetails(false)}
          data={selectedTransactionDetails}
        />
      )}

      {openPayout && (
        <InitiatePayout
          isOpen={openPayout}
          onClose={() => setOpenPayout(false)}
        />
      )}

      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={[
          { option: "CREDIT", value: "CREDIT" },
          { option: "DEBIT", value: "DEBIT" },
        ]}
      />
    </div>
  );
};

export default LoanWallet;
