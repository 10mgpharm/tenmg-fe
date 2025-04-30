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
import { transactionData } from "@/data/mockdata";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import { cn } from "@/lib/utils";

const LoanWallets = ({ filterDate }: { filterDate: string }) => {
  const awaiting = transactionData.filter((item) => item.type === "Awaiting");
  const completed = transactionData.filter((item) => item.type === "Completed");
  const history = transactionData.filter((item) => item.type === "History");
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
  const [tableData, setTableData] = useState(null);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [status, setStatus] = useState("pending");
  const [dataType, setDataType] = useState<
    "awaiting" | "completed" | "history"
  >("awaiting");
  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchOverViewData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        "/admin/wallet"
      );

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

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }
    if (status) {
      query += `&status=${status}`;
    }
    if (createdAtStart) {
      query += `&dateFrom=${createdAtStart.toISOString().split("T")[0]}`;
    }
    if (createdAtEnd) {
      query += `&dateTo=${createdAtEnd.toISOString().split("T")[0]}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setTableData(response.data);
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
        <div className="flex flex-nowrap gap-4 overflow-x-scroll no-scrollbar  ">
          <div
            className={cn(
              "rounded-lg text-gray-700 bg-gray-100 px-4 py-2",
              status === "pending" && " text-white bg-[#1A70B8]"
            )}
            onClick={() => setStatus("pending")}
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Awaiting Payout</Text>
              <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                {awaiting?.length}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "rounded-lg text-gray-700 bg-gray-100 px-4 py-2",
              status === "success" && "text-white bg-[#1A70B8]"
            )}
            onClick={() => setStatus("success")}
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Completed Payout</Text>
              <p className="bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm">
                {completed?.length}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "rounded-lg text-gray-700 bg-gray-100 px-4 py-2",
              status === "" && "text-white bg-[#1A70B8]"
            )}
            onClick={() => setStatus("")}
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Transaction History</Text>
              <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                {history?.length}
              </p>
            </div>
          </div>
        </div>

        {/* TODO: adeola said there is no need for status, but include transaction type */}
        <WalletTable
          data={tableData?.data || []}
          type={
            status === "pending"
              ? "awaiting"
              : status === "success"
              ? "completed"
              : "history"
          }
          walletType="loan_wallet"
          isLoading={isLoadingTable}
        />
      </div>
    </div>
  );
};

export default LoanWallets;
