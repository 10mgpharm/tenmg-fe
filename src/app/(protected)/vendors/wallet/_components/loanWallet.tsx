import React, { useEffect, useState } from "react";
import { OverviewCard } from "./overviewCard";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import Link from "next/link";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { transactionData } from "@/data/mockdata";
import DataTable from "./table";
import { Awaiting_column } from "./colunms/awaiting_column";
import { Completed_column } from "./colunms/completed_column";
import { Transaction_column } from "./colunms/transaction_column";
import TransactionDetails from "./transactionDetails";
import InitiatePayout from "./initiate_payout";
import AccoundDetailsCard from "./AccoundDetailsCard";
import OTPModal from "@/app/(protected)/suppliers/wallet/_components/OTPModal";
import WithdrawFunds from "@/app/(protected)/suppliers/wallet/_components/WithdrawFunds";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const LoanWallet = () => {
  // const awaiting = transactionData.filter((item) => item.type === "Awaiting");
  // const completed = transactionData.filter((item) => item.type === "Completed");
  const history = transactionData.filter((item) => item.type === "History");


  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [openDetails, setOpenDetails] = React.useState(false);
  const [openPayout, setOpenPayout] = React.useState(false);
  const [openCompleted, setOpenCompleted] = React.useState(false);

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

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [amount, setAmount] = useState<number>(0);
  const [transactions, setTransactions] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    const fetchStat = async () => {

      try {
        const response = await requestClient({ token: token }).get(
          `/vendor/wallet`,
        );
        if (response.status === 200) {
          // console.log(response?.data?.data);
          console.log(response?.data);
          setStats(response?.data);
          setLoading(false);
        }
      }
      catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
    token && fetchStat()
  }, [token])
  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async () => {

      try {
        const response = await requestClient({ token: token }).get(
          `/vendor/wallet/transactions`,
        );
        if (response.status === 200) {
          console.log(response?.data?.data?.data);
          setTransactions(response?.data?.data?.data);
          setLoading(false);
        }
      }
      catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
    token && fetchTransactions()
  }, [token])

  const [showBalance, setShowBalance] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-5 ">
        <div className="w-full relative">
          <div className="absolute top-2 right-2 cursor-pointer z-40 text-white" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? (<FaEye className="w-5 h-5" />) : (<FaEyeSlash className="w-5 h-5" />)}
          </div>
          <OverviewCard
            title=" Credit Voucher"
            value={showBalance ? "******" : stats?.voucherBalance}
            fromColor="from-[#53389E]"
            toColor="to-[#7F56D9]"
            image={totalPattern}
          />
        </div>
        <div className="w-full relative">
          <OverviewCard
            title="Available Balance"
            value={showBalance ? "******" : stats?.payoutBalance}
            fromColor="from-[#DC6803]"
            toColor="to-[#DC6803]"
            image={orderPattern}
            func_btn="Withdraw Funds"
            func={() => setOpenPayout(true)}
          />
        </div>
        {/* <OverviewCard
          title="Total Payout"
          value="₦50,000"
          fromColor="from-[#E31B54]"
          toColor="to-[#E31B54]"
          image={productPattern}
        /> */}
        <AccoundDetailsCard showBalance={showBalance} />
      </div>

      <div className="flex items-center justify-between my-5">
        <h3 className="font-medium text-[18px] ">Transactions</h3>

        <Link
          href={"/vendors/wallet/loan-wallet"}
          className="text-gray-600 text-sm px-4 py-2 font-medium bg-white border border-[#D0D5DD] rounded-md"
        >
          View All
        </Link>
      </div>

      <DataTable
        data={transactions}
        column={Awaiting_column(
          setOpenDetails,
          setOpenPayout,
          setOpenCompleted
        )}
        hasPagination={false}
        isLoading={loading}
      />

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

      {/* <WithdrawFunds
        isOpen={isOpenWithdraw}
        onClose={onCloseWithdraw}
        wallet={wallet}
        setAmount={setAmount}
        onSuccess={onOpenSuccess}
        setIsWithdraw={setIsWithdraw}
      /> */}

      <OTPModal isOpen={isOpenOTP} onClose={onCloseOTP} />
    </div>
  );
};

export default LoanWallet;
