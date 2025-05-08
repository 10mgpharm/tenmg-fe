"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import TimeLineSelector from "./_components/TimeLineSelector";
import { useSession } from "next-auth/react";
import { LoanTransactionProps, LoanWalletProps, NextAuthUserSession, WalletProductProps } from "@/types";
import requestClient from "@/lib/requestClient";
import ProductWalletTab from "./_components/ProductWalletTab";
import LoanWalletTab from "./_components/LoanWalletTab";

const Page = () => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [walletStats, setWalletStats] = useState<WalletProductProps>();
  const [loanWallet, setLoanWallet] = useState<LoanWalletProps>();
  const [loanTransaction, setLoanTransaction] = useState<LoanTransactionProps[]>([]);

  const fetchingWallet = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/admin/wallet-product`
      );
      if (response.status === 200) {
        setWalletStats(response.data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token]);

  const fetchingLoanWallet = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        "/admin/wallet"
      );
      if (response.status === 200) {
        setLoanWallet(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [token]);

  const fetchingLoanTransactions = useCallback(async () => {
    setLoading(true);
    let query = `/admin/wallet/transactions?page=${pageCount}`;
    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setLoanTransaction(response.data?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [token, pageCount]);

  useEffect(() => {
    if (!token) return;
    fetchingWallet();
    fetchingLoanWallet();
    fetchingLoanTransactions();
  }, [token]);

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
            <ProductWalletTab 
            transactions={walletStats}
            setPageCount={setPageCount}
            />
          </TabPanel>
          <TabPanel className=" !p-0">
            <LoanWalletTab
            data={loanWallet}
            transactions={loanTransaction}
            filterDate={selectedTimeLine}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Page;
