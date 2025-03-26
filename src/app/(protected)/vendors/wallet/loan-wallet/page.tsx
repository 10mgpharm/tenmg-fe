"use client";

import React, { useState } from "react";
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
import { Awaiting_column } from "../_components/colunms/awaiting_column";
import { Transaction_column } from "../_components/colunms/transaction_column";
import { Completed_column } from "../_components/colunms/completed_column";

const LoanWallet = () => {
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openPayout, setOpenPayout] = React.useState(false);
  const [openCompleted, setOpenCompleted] = React.useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagecount, setPageCount] = useState(1);

  const awaiting = transactionData.filter((item) => item.type === "Awaiting");
  const completed = transactionData.filter((item) => item.type === "Completed");
  const history = transactionData.filter((item) => item.type === "History");

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

        {/* time line selector */}
        <TimeLineSelector
          selectedTimeLine={selectedTimeLine}
          setSelectedTimeLine={setSelectedTimeLine}
        />
      </div>

      <Tabs variant={"unstyled"} className="w-full mt-7">
        <div className="flex items-center justify-between gap-3 max-lg:flex-col-reverse max-lg:items-start">
          {/* Tabs */}
          <TabList className="flex max-md:w-full items-center gap-3 max-md:overflow-x-scroll no-scrollbar">
            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="bg-gray-100  text-[15px] text-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Text className="text-nowrap">Loan Repayment History</Text>
                <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                  {history?.length}
                </p>
              </div>
            </Tab>

            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="bg-gray-100  text-[15px] text-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Text className="text-nowrap"> Awaiting Payout</Text>
                <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                  {awaiting?.length}
                </p>
              </div>
            </Tab>

            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="bg-gray-100  text-[15px] text-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Text className="text-nowrap"> Completed Payout</Text>
                <p className="bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm">
                  {completed?.length}
                </p>
              </div>
            </Tab>
          </TabList>

          {/* Search con */}
          <SearchInput
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* panels */}
        <TabPanels className="mt-5">
          {/* Loan Repayment History Table */}
          <TabPanel className="!p-0">
            <div className="">
              <DataTable
                column={Transaction_column(
                  setOpenDetails,
                  setOpenPayout,
                  setOpenCompleted
                )}
                data={history}
                isLoading={false}
                hasPagination={true}
                metaData={metaData}
                setPageCount={setPageCount}
              />
            </div>
          </TabPanel>

          {/*  Awaiting Payout Table */}
          <TabPanel className=" !p-0">
            <div className="">
              <DataTable
                column={Awaiting_column(
                  setOpenDetails,
                  setOpenPayout,
                  setOpenCompleted
                )}
                data={awaiting}
                isLoading={false}
                hasPagination={true}
                metaData={metaData}
                setPageCount={setPageCount}
              />
            </div>
          </TabPanel>

          {/* Completed Payout Table */}
          <TabPanel className=" !p-0">
            <div className="">
              <DataTable
                column={Completed_column(
                  setOpenDetails,
                  setOpenPayout,
                  setOpenCompleted
                )}
                metaData={metaData}
                setPageCount={setPageCount}
                data={history}
                isLoading={false}
                hasPagination={true}
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

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
