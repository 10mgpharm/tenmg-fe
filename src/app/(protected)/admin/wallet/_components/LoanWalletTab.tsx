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
  { filterDate, data, transactions }: 
  { filterDate: string, data: LoanWalletProps, transactions: LoanTransactionProps[] }
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
          Transaction
        </Text>
        <Link
          className="py-2 px-4 rounded-md border text-sm font-medium text-gray-600 border-gray-300"
          href={"/admin/wallet/loan-wallet"}
        >
          View all
        </Link>
      </HStack>

      <div className="flex flex-col gap-3">
        <LoanTable 
        data={transactions}
        />
      </div>
    </div>
  );
};

export default LoanWalletTab;
