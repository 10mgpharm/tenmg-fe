"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { LoanTransactionDataProps, NextAuthUserSession } from "@/types";
import LoanTable from "../_components/LoanTable";
import { useDebouncedValue } from "@/utils/debounce";

const LoanWallet = () => {

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loanTransaction, setLoanTransaction] = useState<LoanTransactionDataProps>();
  const [adminTransaction, setAdminTransaction] = useState<LoanTransactionDataProps>();

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchingLoanTransactions = useCallback(async () => {
    setLoading(true);
    let query = `/admin/wallet/transactions?page=${pageCount}&search=${debouncedSearch}`;
    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setLoanTransaction(response.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [token, pageCount, debouncedSearch]);

  const fetchingLoanWalletTransactions = useCallback(async () => {
    setLoading(true);
    let query = `/admin/wallet/admin-transactions?page=${pageCount}&search=${debouncedSearch}`;
    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setAdminTransaction(response.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [token, pageCount, debouncedSearch]);

  useEffect(() => {
    if(!token) return;
    fetchingLoanTransactions();
    fetchingLoanWalletTransactions();
  }, [fetchingLoanTransactions, fetchingLoanWalletTransactions, token]);

  return (
    <div className="px-6 py-8 md:p-8">
      <Link
        href={"/admin/wallet"}
        className="flex items-center gap-2 tetx-[15px] hover:text-gray-800 pb-2 text-primary-600 w-fit"
      >
        <ArrowLeft size={20} />
        Back
      </Link>
      <div className="flex items-center justify-between max-sm:flex-wrap max-sm:items-start max-sm:gap-3 mb-5">
        <div className="text-[18px] font-semibold">Loan Wallet</div>
      </div>
      <div className="flex items-center justify-between gap-4 max-lg:flex-col-reverse max-lg:items-start">
        <SearchInput
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <div className="mt-5">
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
              pageCount={pageCount}
              hasPagination={true}
              data={loanTransaction?.data}
              setPageCount={setPageCount}
              metaData={loanTransaction?.meta}
              />
            </TabPanel>
            <TabPanel px={0}>
              <LoanTable 
              type="repayment"
              pageCount={pageCount}
              hasPagination={true}
              data={adminTransaction?.data}
              setPageCount={setPageCount}
              metaData={adminTransaction?.meta}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default LoanWallet;
