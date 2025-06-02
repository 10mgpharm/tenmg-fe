"use client";

import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";

import folder from "@public/assets/images/Group 3.svg";
import drugImage from "@public/assets/images/MedicineStreamline-Lagos1.svg";
import AddAccount from "./_components/AddAccount";
import { Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import WithdrawFunds from "./_components/WithdrawFunds";
import OTPModal from "./_components/OTPModal";
import Link from "next/link";
import Transaction from "./_components/Transaction";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { BankDto, NextAuthUserSession, PayoutDataProps, SupplierTransactionDataProps } from "@/types";
import { getBankList } from "@/app/(standalone)/widgets/applications/actions";
import { PencilIcon } from "lucide-react";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";

export interface BankInfo {
  accountName: string;
  accountNumber: string;
  active: number;
  bankCode: string;
  bankName: string;
  id: number;
}

interface WalletProps {
  wallet: {
    currentBalance: string;
    previousBalance: string;
    bankAccount: BankInfo;
  }
  pendingBalance: string;
}

interface SelectOption {
  label: string;
  value: number;
}

const Wallet = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [amount, setAmount] = useState<number>();
  const [showBalance, setShowBalance] = useState(true);
  const [banks, setBanks] = useState<SelectOption[] | null>(null);
  const [walletBalance, setWalletBalance] = useState<WalletProps>();
  const [transactions, setTransactions] = useState<SupplierTransactionDataProps>();
  const [pendingPayouts, setPendingPayout] = useState<PayoutDataProps>();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  useEffect(() => {
    const fetchingBankList = async () => {
      try {
        const response = await getBankList(token);
        if (response.status === "error") {
          setBanks([]);
        } else {
          const bankList: BankDto[] = response.data;
          setBanks(
            bankList.map((bank) => ({
              label: bank.name,
              value: bank.code,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching bank list:", error);
        setBanks([]);
      }
    }
    if (!token) return;
    fetchingBankList();
  }, [token]);

  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const fetchingWallet = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(`/supplier/wallet`);
      if (response.status === 200) {
        setWalletBalance(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchingTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(
        `/supplier/wallet/transactions`
      );
      if (response.status === 200) {
        setTransactions(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchingPendingPayout = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(
        `/supplier/wallet/pending-payout`
      );
      if (response.status === 200) {
        setPendingPayout(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchingWallet();
    fetchingTransactions();
    fetchingPendingPayout();
  }, [token, fetchingTransactions, fetchingWallet, fetchingPendingPayout]);

  const formattedBalance = walletBalance?.wallet?.currentBalance
    ? Number(walletBalance?.wallet?.currentBalance).toFixed(2)
    : "0.00";

  const handleWithdraw = async () => {
    setLoading(true);
    const payload = {
      amount: amount,
      otp: otp
    }
    try {
      const response = await requestClient({ token }).post(
        `/supplier/withdraw-funds`,
        payload
      );
      if( response.status === 200) {
        toast.success("Withdrawal successful");
        fetchingWallet();
        fetchingTransactions();
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
    <div className="p-5 sm:p-8">
      <h3 className="font-semibold text-xl text-gray-700 mb-4">Wallet</h3>
      <div className="md:flex gap-5">
        {/* Balance section */}
        <div className="relative flex-1 bg-primary-50 pt-3 pb-5 pl-5 rounded-lg lg:flex lg:justify-between mb-3 md:mb-0">
          <div className="relative z-50">
            <div className="mt-5 flex items-center gap-3">
              <p className="text-xl">Wallet Balance</p>
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? 
                <FaEye className="w-5 h-5" /> : 
                <FaEyeSlash className="w-5 h-5" />
                }
              </button>
            </div>
            <p className="font-semibold text-2xl text-gray-700 mt-3">
              {showBalance ? `₦${formattedBalance}` : "******"}
            </p>
            <div className="mt-2 mb-6">
              <div className="bg-green-50 rounded-md py-1 max-w-max px-2.5">
                <p className="text-green-600 font-medium text-xs">Pending Balance</p>
                <p className="text-green-600 text-xs font-semibold">
                  {showBalance ? `₦${walletBalance?.pendingBalance ?? 0.00}` : "******"}
                </p>
              </div>
            </div>
            {walletBalance?.wallet?.bankAccount && (
              <button
                onClick={onOpenWithdraw}
                className="bg-primary-500 px-5 py-2 text-white rounded-md"
              >
                Withdraw Funds
              </button>
            )}
          </div>
          <div className="absolute top-1 z-10 md:right-0 md:top-0">
            <Image src={drugImage} alt="wallet art" className="" />
          </div>
        </div>

        {/* Bank info or Add account */}
        {walletBalance?.wallet?.bankAccount ? (
          <div className="flex-1 bg-[#20232D] p-5 rounded-lg text-white">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="py-1 px-2 rounded-full mb-2 sm:mb-0 bg-white max-w-max">
                <p className="text-gray-600 text-xs lg:text-sm font-semibold">
                  {walletBalance?.wallet?.bankAccount?.accountName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div onClick={onOpen} className="py-1 flex items-center gap-2 px-2 rounded-full bg-white cursor-pointer">
                  <p className="text-gray-600 text-xs lg:text-sm font-semibold">
                    {walletBalance?.wallet?.bankAccount?.bankName}
                  </p>
                  <PencilIcon className="w-4 h-4 text-black"/>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-sm mb-2">Payout Account</p>
              <h2 className="text-xl font-semibold">{walletBalance?.wallet?.bankAccount?.accountNumber}</h2>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center bg-primary-50 p-5 rounded-lg">
            <div className="max-w-xs mx-auto text-center">
              <h2 className="text-xl font-medium">Add a bank account</h2>
              <p className="mt-2">
                Add a bank account to enable easy withdrawal of your funds
              </p>
              <button
                onClick={onOpen}
                className="mt-5 bg-primary-500 px-5 py-2 text-white rounded-md"
              >
                Add Account
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Transactions</h3>
          <Link
            href={"/suppliers/wallet/transactions"}
            className="border p-2 px-4 rounded-md"
          >
            View All
          </Link>
        </div>
        {
          transactions?.data?.length === 0 ? (
            <div className="mt-5 max-w-sm mx-auto">
              <div className="text-center py-12">
                <Image src={folder} alt="" className="mx-auto" />
                <h3 className="font-semibold text-lg text-gray-700 mt-4">
                  Nothing to show here yet
                </h3>
                <p className="text-gray-600">
                  You don’t have any transactions yet. When you do, they’ll
                  appear here.
                </p>
              </div>
            </div>
            ) : transactions?.data?.length > 0 ? (
              <div className="mt-5">
                <Transaction 
                data={transactions} 
                payoutData={pendingPayouts}
                hasPagination={false}
                />
              </div>
            ) :
            (
              <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
              </Flex>
            )
        }
      </div>
      <AddAccount
        isOpen={isOpen}
        onClose={onClose}
        bank={walletBalance?.wallet?.bankAccount}
        fetchingWallet={fetchingWallet}
        endpoint="/supplier/wallet/add-bank-account"
      />
      <WithdrawFunds
        isOpen={isOpenWithdraw}
        onClose={onCloseWithdraw}
        otpOpen={onOpenOTP}
        amount={amount}
        setAmount={setAmount}
        bankDetails={walletBalance?.wallet?.bankAccount}
      />
      <OTPModal 
      isOpen={isOpenOTP} 
      onClose={onCloseOTP}
      setOtp={setOtp}
      otp={otp}
      loading={loading}
      handleWithdraw={handleWithdraw}
      />
    </div>
  );
};

export default Wallet;
