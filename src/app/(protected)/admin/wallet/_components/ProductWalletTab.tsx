import React, { Dispatch, SetStateAction, useState } from "react";
import {
  HStack,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { BankAccountProps, NextAuthUserSession, WalletProductProps } from "@/types";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import TransactionTab from "./TransactionTab";
import WalletOverview from "./WalletOverview";
import OTPModal from "@/app/(protected)/suppliers/wallet/_components/OTPModal";
import WithdrawFunds from "@/app/(protected)/suppliers/wallet/_components/WithdrawFunds";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { useSession } from "next-auth/react";

interface Props {
  fetchingWallet: () => void;
  transactions: WalletProductProps;
  bankInfo?: BankAccountProps;
  setPageCount: Dispatch<SetStateAction<number>>;
}
const ProductWalletTab = ({ transactions, setPageCount, bankInfo, fetchingWallet }: Props) => {

  const [otp, setOtp] = useState('');
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const {
    isOpen: isOpenWithdraw,
    onOpen: onOpenWithdraw,
    onClose: onCloseWithdraw,
  } = useDisclosure();
  const {
    isOpen: isOpenOTP,
    onOpen: onOpenOTP,
    onClose: onCloseOTP,
  } = useDisclosure();

  const handleWithdraw = async () => {
    setLoading(true);
    const payload = {
      amount: amount,
      otp: otp
    }
    try {
      const response = await requestClient({ token }).post(
        `/admin/withdraw-funds`,
        payload
      );
      if( response.status === 200) {
        toast.success("Withdrawal successful");
        fetchingWallet();
        onCloseOTP();
      }
    } catch (error) {
      console.error(error);
      toast.error(handleServerErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

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
          hasWidthdrawButton={false}
          pendingBg="bg-[#c5b4f5]"
          pendingText="text-[#7F56D9]"
          pendingBalance={`${Number(transactions?.totalPendingCommissions ?? 0.00)?.toLocaleString()}`}
        />
        <WalletOverview
          title="Total Payouts to Suppliers"
          value={`₦${Number(transactions?.totalSupplierPayout ?? 0.00)?.toLocaleString()}`}
          fromColor="from-[#DC6803]"
          toColor="to-[#DC6803]"
          image={orderPattern}
          hasPendingBalance={true}
          hasWidthdrawButton={false}
          pendingBg="bg-[#FFF4E5]"
          pendingText="text-[#DC6803]"
          pendingBalance={`${Number(transactions?.totalPendingSupplierPayout ?? 0.00)?.toLocaleString()}`}
        />
        <WalletOverview
          title="Wallet Balance"
          value={`₦${Number(transactions?.wallet?.currentBalance ?? 0.00)?.toLocaleString()}`}
          fromColor="from-[#E31B54]"
          toColor="to-[#E31B54]"
          image={productPattern}
          hasPendingBalance={true}
          hasWidthdrawButton={true}
          pendingBg="bg-[#FFE5ED]"
          pendingText="text-[#E31B54]"
          pendingBalance={"0.00"}
          onOpenWithdraw={onOpenWithdraw}
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
              <Text className="text-nowrap">Payout </Text>
            </div>
          </Tab>
          <Tab
            _selected={{ color: "white", bg: "#1A70B8" }}
            className="rounded-lg text-gray-700 bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Transaction History</Text>
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
      <WithdrawFunds
        isOpen={isOpenWithdraw}
        onClose={onCloseWithdraw}
        otpOpen={onOpenOTP}
        amount={amount}
        setAmount={setAmount}
        bankDetails={bankInfo}
      />
      <OTPModal 
        isOpen={isOpenOTP}
        onClose={onCloseOTP}
        otp={otp}
        setOtp={setOtp}
        loading={loading}
        handleWithdraw={handleWithdraw}
       />
    </div>
  );
};

export default ProductWalletTab;
