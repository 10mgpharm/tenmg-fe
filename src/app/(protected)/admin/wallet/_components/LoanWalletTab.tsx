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
import { LoanTransactionProps, LoanWalletProps, WalletProductProps } from "@/types";
import WalletOverview from "./WalletOverview";
import TransactionTab from "./TransactionTab";
import LoanTable from "./LoanTable";

const LoanWalletTab = (
  { filterDate, data, transactions, adminTransactions }: 
  { filterDate: string, data: LoanWalletProps, transactions: LoanTransactionProps[], adminTransactions: LoanTransactionProps[]  }
) => {
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
          Transactions
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
              <Text className="text-nowrap">Credit Activity </Text>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8" }}
            className="rounded-lg text-gray-700 bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Transactions</Text>
            </div>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
          <LoanTable 
          type="credit"
          data={transactions}
          hasPagination={false}
          />
          </TabPanel>
          <TabPanel px={0}>
          <LoanTable 
          type="repayment"
          data={adminTransactions}
          hasPagination={false}
          />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default LoanWalletTab;
