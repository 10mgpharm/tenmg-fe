"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import ProductWallet from "./_components/productWallet";
import LoanWallets from "./_components/LoanWallets";
import TimeLineSelector from "./_components/TimeLineSelector";
import { useSession } from "next-auth/react";
import {
  NextAuthUserSession,
  TransactionDataProps,
  TransactionProps,
} from "@/types";
import requestClient from "@/lib/requestClient";

const Page = () => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [transactions, setTransactions] = useState<TransactionDataProps>();
  const [walletStats, setWalletStats] = useState<TransactionProps>();

  const fetchingTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/wallet/transactions?page=${pageCount}&perPage=10`
      );
      if (response.status === 200) {
        setTransactions(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount]);

  const fetchingWallet = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/wallet`
      );
      console.log(response);
      if (response.status === 200) {
        setWalletStats(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchingWallet();
    fetchingTransactions();
  }, [token]);

  console.log(walletStats);

  return (
    <div className="px-6 py-8 md:p-8 ">
      <Tabs
        variant={"unstyled"}
        className="w-full"
        onChange={() => setSelectedTimeLine("All time")}
      >
        {/* Tabs */}
        <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-4">
          <TabList className="flex items-center gap-4">
            <Tab
              _selected={{
                color: "white",
                bg: "#1A70B8",
              }}
              className="text-[16px] font-medium text-gray-700 bg-gray-100 rounded-lg"
            >
              Product Wallet
            </Tab>

            <Tab
              _selected={{
                color: "white",
                bg: "#1A70B8",
              }}
              className="text-[16px] font-medium text-gray-600 bg-gray-100 rounded-lg"
            >
              Loan Wallet
            </Tab>
          </TabList>

          {/* Date filter */}
          <TimeLineSelector
            selectedTimeLine={selectedTimeLine}
            setSelectedTimeLine={setSelectedTimeLine}
          />
        </div>

        {/* panels */}
        <TabPanels className="mt-10 max-sm:mt-8">
          <TabPanel className="!p-0">
            <ProductWallet
              transactions={transactions}
              setPageCount={setPageCount}
            />
          </TabPanel>
          <TabPanel className=" !p-0">
            <LoanWallets filterDate={selectedTimeLine} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Page;
