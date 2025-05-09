"use client";

import React, { useEffect, useState } from "react";
import TimeLineSelector from "../_components/TimeLineSelector";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { transactionData } from "@/data/mockdata";
import DataTable from "../_components/table";
import TransactionDetails from "../_components/transactionDetails";
import InitiatePayout from "../_components/initiate_payout";

import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import SearchInput from "../../_components/SearchInput";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { Awaiting_column } from "../_components/colunms/awaiting_column";

const LoanWallet = () => {
  // const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openPayout, setOpenPayout] = React.useState(false);
  const [openCompleted, setOpenCompleted] = React.useState(false);
  // const [searchValue, setSearchValue] = useState<string>("");
  // const [pagecount, setPageCount] = useState(1);
  const [transactions, setTransactions] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/vendor/wallet/transactions`,
      );
      if (response.status === 200) {
        // console.log(response?.data?.data?.data);
        setTransactions(response?.data?.data?.data);
        setLoading(false);
      }
    }
    catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  useEffect(() => {
    token && fetchTransactions()
  }, [token, fetchTransactions]);

  const metaData = {
    links: "",
    prevPageUrl: "",
    nextPageUrl: "",
    currentPage: 1,
    firstPageUrl: "",
    lastPageUrl: "",
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

      <div className="flex items-center justify-between max-sm:flex-wrap max-sm:items-start max-sm:gap-3">
        <div className="text-[18px] font-semibold">Loan Wallet</div>
      </div>

      {/* <div className="flex items-center justify-between gap-3 max-lg:flex-col-reverse max-lg:items-start"> */}
      <DataTable
        data={transactions}
        column={Awaiting_column(
          setOpenDetails,
          setOpenPayout,
          setOpenCompleted
        )}
        hasPagination={false}
        isLoading={loading}
      />
      {/* </div> */}



      {/* Side sheets */}
      {openDetails && (
        <TransactionDetails
          isOpen={openDetails}
          onClose={() => setOpenDetails(false)}
        />
      )}

      {openPayout && (
        <InitiatePayout
          isOpen={openPayout}
          onClose={() => setOpenPayout(false)}
        />
      )}
    </div>
  );
};

export default LoanWallet;
