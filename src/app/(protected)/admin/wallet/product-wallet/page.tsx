"use client";

import React, { useCallback, useEffect, useState } from "react";
import TimeLineSelector from "../_components/TimeLineSelector";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WalletTable from "../_components/TransactionTab";

import {
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import { NextAuthUserSession, WalletProductProps } from "@/types";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import TransactionTab from "../_components/TransactionTab";

const ProductWallet = () => {

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [data, setData] = useState<WalletProductProps>();
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [searchValue, setSearchValue] = useState<string>("");

  const fetchingWallet = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/wallet-product?page=${pageCount}`
      );
      if (response.status === 200) {
        setData(response.data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount]);

  console.log(pageCount);

  useEffect(() => {
    if(!token) return;
    fetchingWallet();
  }, [token, fetchingWallet]);

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
        <div className="text-[18px] font-semibold">Product Wallet</div>

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
              onClick={() => setPageCount(1)}
            >
              <div className="flex items-center gap-3">
                <Text className="text-nowrap">Payout </Text>
              </div>
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="rounded-lg text-gray-700 bg-gray-100"
              onClick={() => setPageCount(1)}
            >
              <div className="flex items-center gap-3">
                <Text className="text-nowrap">Transaction History</Text>
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
            <TransactionTab 
            type="awaiting"
            data={data?.payouts}
            setPageCount={setPageCount}
            hasPagination={true}
            metaData={{
              links: data?.payouts?.links,
              total: data?.payouts?.total,
              lastPage: data?.payouts?.lastPage,
              perPage: data?.payouts?.perPage,
              from: data?.payouts?.from,
              to: data?.payouts?.to,
              prevPageUrl: data?.payouts?.prevPageUrl,
              nextPageUrl: data?.payouts?.nextPageUrl,
              currentPage: data?.payouts?.currentPage,
              firstPageUrl: data?.payouts?.firstPageUrl,
              lastPageUrl: data?.payouts?.lastPageUrl,
            }}
            emptyStateHeader="No awaiting payout"
            />
          </TabPanel>
          <TabPanel px={0}>
          <TransactionTab 
            type="transaction"
            data={data?.transactions}
            setPageCount={setPageCount}
            hasPagination={true}
            metaData={{
              links: data?.transactions?.links,
              total: data?.transactions?.total,
              lastPage: data?.transactions?.lastPage,
              perPage: data?.transactions?.perPage,
              from: data?.transactions?.from,
              to: data?.transactions?.to,
              prevPageUrl: data?.transactions?.prevPageUrl,
              nextPageUrl: data?.transactions?.nextPageUrl,
              currentPage: data?.transactions?.currentPage,
              firstPageUrl: data?.transactions?.firstPageUrl,
              lastPageUrl: data?.transactions?.lastPageUrl,
            }}
            emptyStateHeader="No transaction history"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ProductWallet;
