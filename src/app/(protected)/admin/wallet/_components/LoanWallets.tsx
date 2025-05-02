import React, { useCallback, useState } from "react";
import {
  HStack,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import Link from "next/link";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { LoanWalletProps, NextAuthUserSession, WalletProductProps } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import WalletOverview from "./WalletOverview";
import TransactionTab from "./TransactionTab";

const LoanWallets = ({ filterDate, data, transactions }: { filterDate: string, data: LoanWalletProps, transactions: WalletProductProps }) => {

  const [overViewData, setOverViewData] = useState<{
    totalLenders: string;
    vendorPayouts: string;
    walletBalance: string;
  }>();
 
  const [pageCount, setPageCount] = useState(1);

  console.log(overViewData);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-5 ">
        <WalletOverview
          title="Total Amount from Lenders"
          value={`₦${Number(data?.totalLenders ?? 0.00)?.toLocaleString()}`}
          fromColor="from-[#53389E]"
          toColor="to-[#7F56D9]"
          image={totalPattern}
          hasPendingBalance={false}
        />
        <WalletOverview
          title=" Total Payout for Vendors"
          value={`₦${Number(data?.vendorPayouts ?? 0.00)?.toLocaleString()}`}
          fromColor="from-[#DC6803]"
          toColor="to-[#DC6803]"
          image={orderPattern}
          hasPendingBalance={false}
        />
        <WalletOverview
          title="Wallet Balance"
          value={`₦${Number(data?.walletBalance ?? 0.00)?.toLocaleString()}`}
          fromColor="from-[#E31B54]"
          toColor="to-[#E31B54]"
          image={productPattern}
          hasPendingBalance={false}
        />
      </div>

      <HStack
        justify={"space-between"}
        mt={8}
        className="flex justify-between pb-2"
      >
        <Text fontSize={"xl"} fontWeight={"medium"} color={"gray.800"}>
          Transaction
        </Text>
        <Link
          className="py-2 px-4 rounded-md border text-sm font-medium text-gray-600 border-gray-300"
          href={"/admin/wallet/loan-wallet"}
        >
          View all
        </Link>
      </HStack>

      <Tabs variant={"unstyled"}>
        <TabList className="flex flex-nowrap gap-4 overflow-x-scroll no-scrollbar  ">
          <Tab
            _selected={{ color: "white", bg: "#1A70B8" }}
            className="rounded-lg text-gray-700 bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Awaiting Payout </Text>
              <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                {transactions?.payouts?.total}
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
                {transactions?.transactions?.total}
              </p>
            </div>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <TransactionTab
              type="awaiting"
              setPageCount={setPageCount}
              data={transactions?.payouts}
            />
          </TabPanel>
          <TabPanel px={0}>
            <TransactionTab
              type="transaction"
              setPageCount={setPageCount}
              data={transactions?.transactions}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <div className="flex flex-col gap-3">
        {/* TODO: adeola said there is no need for status, but include transaction type */}
      </div>
    </div>
  );
};

export default LoanWallets;
