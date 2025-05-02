"use client";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { CiFilter, CiSearch } from "react-icons/ci"
import Transaction from "../_components/Transaction"
import { useCallback, useEffect, useState } from "react"
import { NextAuthUserSession, WalletResponseData } from "@/types"
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";

const TransactionUI = () => {

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<WalletResponseData>();

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
  
  useEffect(() => {
    if (!token) return;
    fetchingTransactions();
  }, [token, fetchingTransactions]);
    
  return (
    <div className="p-8">
        <Link href={"/suppliers/wallet"} className="flex items-center gap-3">
          <ArrowLeftIcon className="w-5 h-5"/>
          <p className="text-lg font-normal">Back</p>
        </Link>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">All Transactions</h2>
            <div className="flex items-center gap-3 mt-5">
                <div className="border border-gray-300 rounded-md flex items-center gap-3 p-3 w-[350px]">
                    <CiSearch className="w-5 h-5" />
                    <input 
                    type="text" 
                    placeholder="Search for transactions" 
                    className="outline-none flex-1 placeholder:text-gray-400 bg-transparent" 
                    />
                </div>
                <div className="border border-gray-300 p-3 rounded-md flex items-center gap-2">
                    <CiFilter className="w-5 h-5" />
                    <p className="text-gray-500 font-medium">Filter</p>
                </div>
            </div>
        </div>
        <div className="mt-4">
            <Transaction data={transactions?.data} />
        </div>
    </div>
  )
}

export default TransactionUI