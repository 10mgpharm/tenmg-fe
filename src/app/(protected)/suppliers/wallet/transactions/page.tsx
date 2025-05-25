"use client";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { CiFilter, CiSearch } from "react-icons/ci"
import Transaction from "../_components/Transaction"
import { useCallback, useEffect, useState } from "react"
import { NextAuthUserSession, PayoutDataProps, SupplierTransactionDataProps, WalletResponseData } from "@/types"
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { useDebouncedValue } from "@/utils/debounce";

const TransactionUI = () => {

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [transactions, setTransactions] = useState<SupplierTransactionDataProps>();
  const [pendingPayouts, setPendingPayout] = useState<PayoutDataProps>();

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchingTransactions = useCallback(async () => {
      setLoading(true);
      try {
        const response = await requestClient({ token }).get(
          `/supplier/wallet/transactions?page=${pageCount}&search=${debouncedSearch}`
        );
        if (response.status === 200) {
          setTransactions(response?.data?.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
  }, [token, pageCount, debouncedSearch]);

  const fetchingPendingPayout = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(
        `/supplier/wallet/pending-payout?page=${pageCount}&search=${debouncedSearch}`
      );
      if (response.status === 200) {
        setPendingPayout(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch]);
  
  useEffect(() => {
    if (!token) return;
    fetchingTransactions();
    fetchingPendingPayout();
  }, [token, fetchingTransactions, fetchingPendingPayout]);
    
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
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search by description or transaction ID" 
                    className="outline-none flex-1 placeholder:text-gray-400 bg-transparent" 
                    />
                </div>
            </div>
        </div>
        <div className="mt-4">
            <Transaction 
            globalFilter={globalFilter}
            data={transactions} 
            payoutData={pendingPayouts} 
            hasPagination={true}
            setPageCount={setPageCount}
            />
        </div>
    </div>
  )
}

export default TransactionUI