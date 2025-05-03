import React, { Dispatch, SetStateAction } from "react";
import {
  HStack,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Link from "next/link";
import { WalletProductProps } from "@/types";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import TransactionTab from "./TransactionTab";
import WalletOverview from "./WalletOverview";

interface Props {
  transactions: WalletProductProps;
  setPageCount: Dispatch<SetStateAction<number>>;
}
const ProductWalletTab = ({ transactions, setPageCount }: Props) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-5 c">
        <WalletOverview
          title="Total Commission Earned"
          value={`₦${Number(transactions?.totalCommissionsEarned ?? 0.00)?.toLocaleString()}`}
          fromColor="from-[#53389E]"
          toColor="to-[#7F56D9]"
          image={totalPattern}
          hasPendingBalance={true}
          pendingBalance={`${Number(transactions?.totalPendingCommissions ?? 0.00)?.toLocaleString()}`}
        />
        <WalletOverview
          title="Total Payouts to Suppliers"
          value={`₦${Number(transactions?.totalSupplierPayout ?? 0.00)?.toLocaleString()}`}
          fromColor="from-[#DC6803]"
          toColor="to-[#DC6803]"
          image={orderPattern}
          hasPendingBalance={true}
          pendingBalance={`${Number(transactions?.totalPendingSupplierPayout ?? 0.00)?.toLocaleString()}`}
        />
        <WalletOverview
          title="Wallet Balance"
          value={`₦${Number(transactions?.wallet?.currentBalance ?? 0.00)?.toLocaleString()}`}
          fromColor="from-[#E31B54]"
          toColor="to-[#E31B54]"
          image={productPattern}
          hasPendingBalance={true}
          pendingBalance={"0.00"}
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
          href={"/admin/wallet/product-wallet"}
        >
          View All
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
              hasPagination={false}
              emptyStateHeader="No Payouts"
            />
          </TabPanel>
          <TabPanel px={0}>
            <TransactionTab
              type="transaction"
              setPageCount={setPageCount}
              data={transactions?.transactions}
              hasPagination={false}
              emptyStateHeader={"No Transactions"}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ProductWalletTab;
