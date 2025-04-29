import React, { useCallback, useEffect, useState } from "react";
import OverviewCard from "./OverviewCard";
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
import WalletTable from "./table";
import { transactionData as txnData } from "@/data/mockdata";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import { cn } from "@/lib/utils";

const LoanWallets = ({ filterDate }: { filterDate: string }) => {
  const awaiting = txnData.filter((item) => item.type === "Awaiting");
  const completed = txnData.filter((item) => item.type === "Completed");
  const history = txnData.filter((item) => item.type === "History");
  const [isLoading, setIsLoading] = useState(false);
  const [overViewData, setOverViewData] = useState<{
    totalLenders: string;
    vendorPayouts: string;
    walletBalance: string;
  }>();
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [status, setStatus] = useState("");
  const [dataType, setDataType] = useState<
    "awaiting" | "completed" | "history"
  >("awaiting");
  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchOverViewData = useCallback(async () => {
    setIsLoading(true);

    let query = `"/admin/wallet"`;

    if (createdAtStart) {
      query += `&dateFrom=${createdAtStart.toISOString().split("T")[0]}`;
    }
    if (createdAtEnd) {
      query += `&dateTo=${createdAtEnd.toISOString().split("T")[0]}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);

      if (response.status === 200) {
        setOverViewData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [token]);

  const fetchTableData = useCallback(async () => {
    setIsLoadingTable(true);

    let query = `/admin/wallet/transactions?page=${pageCount}`;

    if (createdAtStart) {
      query += `&dateFrom=${createdAtStart.toISOString().split("T")[0]}`;
    }
    if (createdAtEnd) {
      query += `&dateTo=${createdAtEnd.toISOString().split("T")[0]}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setTransactionData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoadingTable(false);
  }, [token, pageCount, debouncedSearch, status, createdAtStart, createdAtEnd]);

  useEffect(() => {
    fetchOverViewData();
    fetchTableData();
  }, [fetchOverViewData, fetchTableData]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-5 ">
        <OverviewCard
          title="Total Amount from Lenders"
          value={`₦${overViewData?.totalLenders ?? "0.00"}`}
          fromColor="from-[#53389E]"
          toColor="to-[#7F56D9]"
          image={totalPattern}
        />
        <OverviewCard
          title=" Total Payout for Vendors"
          value={`₦${overViewData?.vendorPayouts ?? "0.00"}`}
          fromColor="from-[#DC6803]"
          toColor="to-[#DC6803]"
          image={orderPattern}
        />
        <OverviewCard
          title="Wallet Balance"
          value={`₦${overViewData?.walletBalance ?? "0.00"}`}
          fromColor="from-[#E31B54]"
          toColor="to-[#E31B54]"
          image={productPattern}
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
        <Tabs variant={"unstyled"}>
          <TabList className="flex flex-nowrap gap-4 overflow-x-scroll no-scrollbar  ">
            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="rounded-lg text-gray-700 bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Text className="text-nowrap"> Payouts </Text>
                <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                  {awaiting?.length}
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
                  {transactionData?.data?.data?.length > 99
                    ? "99+"
                    : transactionData?.data?.data.length + 1}
                </p>
              </div>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <WalletTable
                data={awaiting}
                type="payout"
                walletType="loan_wallet"
                emptyStateHeader="No payout yet"
              />
            </TabPanel>
            <TabPanel px={0}>
              <WalletTable
                data={transactionData?.data?.data.slice(0, 5) ?? []}
                type="history"
                walletType="loan_wallet"
                isLoading={isLoadingTable}
                emptyStateHeader="No transaction history yet"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default LoanWallets;
