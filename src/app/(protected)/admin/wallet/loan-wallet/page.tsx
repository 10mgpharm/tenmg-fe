"use client";

import React, { useState } from "react";
import TimeLineSelector from "../_components/TimeLineSelector";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WalletTable from "../_components/table";
import { transactionData } from "@/data/mockdata";
const completed = transactionData.filter((item) => item.type === "Completed");
import {
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";

const LoanWallet = () => {
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagecount, setPageCount] = useState(1);

  const awaiting = transactionData.filter((item) => item.type === "Awaiting");
  const completed = transactionData.filter((item) => item.type === "Completed");
  const history = transactionData.filter((item) => item.type === "History");

  // random data
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
        href={"/admin/wallet"}
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

      <Tabs variant={"unstyled"} className="mt-7">
        <div className="flex items-center justify-between gap-4 max-lg:flex-col-reverse max-lg:items-start">
          {/* Tabs */}
          <TabList className="flex flex-nowrap gap-4 overflow-x-scroll no-scrollbar  max-lg:w-full">
            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="rounded-lg text-gray-700 bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Text className="text-nowrap">Awaiting Payout </Text>
                <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                  {awaiting?.length}
                </p>
              </div>
            </Tab>

            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="rounded-lg text-gray-700 bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Text className="text-nowrap">Completed Payout</Text>
                <p className="bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm">
                  {completed?.length}
                </p>
              </div>
            </Tab>

            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="rounded-lg text-gray-700 bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Text className="text-nowrap">Transaction History</Text>
                <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                  {history?.length}
                </p>
              </div>
            </Tab>
          </TabList>

          {/* Search */}
          <SearchInput
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <TabPanels>
          <TabPanel px={0}>
            <WalletTable
              data={awaiting}
              type="awaiting"
              walletType="product_wallet"
              hasPagination={true}
              metaData={metaData}
              setPageCount={setPageCount}
              isLoading={false}
            />
          </TabPanel>
          <TabPanel px={0}>
            <WalletTable
              data={completed}
              type="completed"
              walletType="product_wallet"
              hasPagination={true}
              metaData={metaData}
              setPageCount={setPageCount}
              isLoading={false}
            />
          </TabPanel>
          <TabPanel px={0}>
            <WalletTable
              data={history}
              type="history"
              walletType="product_wallet"
              hasPagination={true}
              metaData={metaData}
              setPageCount={setPageCount}
              isLoading={false}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default LoanWallet;
