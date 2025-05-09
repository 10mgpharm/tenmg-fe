"use client";

import {
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  Tabs,
  Spinner,
  Flex,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import TransactionHistoryDrawer from "../_components/TransactionHistoryDrawer";
import SearchInput from "../../vendors/_components/SearchInput";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import LenderEmptyScreen from "../_components/EmptyScreen";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import {
  LenderTransactionHistoryDataProps,
  LoanApplicationDataResponse,
  LoanStats,
  NextAuthUserSession,
} from "@/types";
import { formatAmountString } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import Pagination from "../../suppliers/_components/Pagination";
import { useDebouncedValue } from "@/utils/debounce";
import { flexRender, getSortedRowModel } from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/react-table";
import {
  SortingState,
  ColumnOrderState,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { ColumnsTransactionHistoryFN } from "./_components/table";
import TransactionTabs from "./_components/TransactionsTab";

export default function TransactionHistoryPage() {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const sessionToken = sessionData?.user?.token;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] =
    useState<LenderTransactionHistoryDataProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [type, setType] = useState<string>("");
  const [tabIndex, setTabIndex] = useState(0);
  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);

      const query = `/lender/transactions?page=${page}${
        debouncedSearch ? `&search=${debouncedSearch}` : `&type=${type}`
      }`;
      try {
        const [statsRes, txnsRes] = await Promise.all([
          requestClient({ token: sessionToken }).get(
            "/lender/transactions/stats"
          ),
          requestClient({ token: sessionToken }).get(query),
        ]);
        setStats(statsRes.data?.data);
        setTransactions(txnsRes.data?.data || []);
        setPageCount(txnsRes.data?.data?.meta?.currentPage);
      } catch (err: any) {
        setError("Failed to load data.");
        setStats(null);
        setTransactions(null);
      } finally {
        setLoading(false);
      }
    },
    [sessionToken, debouncedSearch, type]
  );

  useEffect(() => {
    if (sessionToken) fetchData(pageCount);
  }, [sessionToken, fetchData, pageCount]);

  const card_info = useMemo(
    () =>
      stats
        ? [
            {
              title: "Total Deposits",
              value: stats.totalDeposit
                ? `₦${formatAmountString(stats.totalDeposit)}`
                : "₦0",
              bgColor: "#53389E",
              bgImg: "/assets/images/disb_bg.png",
            },
            {
              title: "Total Withdrawals",
              value: stats.totalWithdrawal
                ? `₦${formatAmountString(stats.totalWithdrawal)}`
                : "₦0",
              bgColor: "#DC6803",
              bgImg: "/assets/images/app_bg.png",
            },
            {
              title: "Net Wallet Balance",
              value: stats.netWalletBalance
                ? `₦${formatAmountString(stats.netWalletBalance)}`
                : "₦0",
              bgColor: "#3E4784",
              bgImg: "/assets/images/pend_bg.png",
            },
            {
              title: "Last Transaction Date",
              value: convertDate(stats.lastTransactionDate) || "-",
              bgColor: "#E31B54",
              bgImg: "/assets/images/tot_bg.png",
            },
          ]
        : [],
    [stats]
  );

  const records = useMemo(() => transactions?.data || [], [transactions?.data]);
  const renderedColumn = ColumnsTransactionHistoryFN();

  const table = useReactTable({
    data: records,
    columns: renderedColumn,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      rowSelection,
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    setPageCount(1);
    if (index === 0) {
      setType("");
    } else if (index === 1) {
      setType("Credit");
    } else if (index === 2) {
      setType("Debit");
    }
  };

  console.log("table", pageCount, "dfdfd", transactions);

  return (
    <div className="px-4">
      <h3 className="font-semibold text-xl my-4">Transaction History</h3>

      <>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          {card_info.map((item, index) => (
            <div
              key={index}
              className="relative h-32 bg-cover bg-center bg-no-repeat rounded-lg p-4 flex items-center"
              style={{ backgroundImage: `url(${item.bgImg})` }}
            >
              <div
                className="absolute inset-0  bg-opacity-10 rounded-md"
                style={{ backgroundColor: item.bgColor }}
              ></div>
              <div className="relative z-10 text-white">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-base font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <Tabs
            variant="enclosed-colored"
            isFitted
            onChange={handleTabsChange}
            index={tabIndex}
          >
            <div className="flex items-center justify-between flex-col lg:flex-row mt-8">
              <TabList>
                <Tab
                  _selected={{
                    color: "white",
                    bg: "#1A70B8",
                  }}
                >
                  All
                </Tab>
                <Tab
                  _selected={{
                    color: "white",
                    bg: "#1A70B8",
                  }}
                >
                  Incoming
                </Tab>
                <Tab
                  _selected={{
                    color: "white",
                    bg: "#1A70B8",
                  }}
                >
                  Outgoing
                </Tab>
              </TabList>

              <div className="flex items-center gap-3 my-5">
                <SearchInput
                  placeholder="Search for Transaction Id"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
                {/* <Menu>
                  <MenuButton
                    as={Button}
                    variant={"unstyled"}
                    size={"md"}
                    px="8px"
                    className=" cursor-pointer  "
                  >
                    <p
                      className="text-gray-500 border border-gray-300 rounded-md flex items-center"
                      style={{ padding: "8px 20px" }}
                    >
                      Filters
                    </p>
                  </MenuButton>
                  <MenuList></MenuList>
                </Menu> */}
              </div>
            </div>
            {loading ? (
              <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" />
              </Flex>
            ) : error ? (
              <div className="text-center text-red-500 my-8">{error}</div>
            ) : (
              <>
                {transactions?.data?.length > 0 ? (
                  <TabPanels>
                    <TabPanel px={0}>
                      <TransactionTabs
                        table={table}
                        setPageCount={setPageCount}
                        transactions={transactions}
                      />
                    </TabPanel>
                    <TabPanel>
                      <TransactionTabs
                        table={table}
                        setPageCount={setPageCount}
                        transactions={transactions}
                      />
                    </TabPanel>
                    <TabPanel>
                      <TransactionTabs
                        table={table}
                        setPageCount={setPageCount}
                        transactions={transactions}
                      />
                    </TabPanel>
                  </TabPanels>
                ) : (
                  <LenderEmptyScreen
                    heading="Nothing to show here yet"
                    content="You don't have any transactions yet. When you do, they'll appear here."
                  />
                )}
              </>
            )}
          </Tabs>
        </div>
      </>
    </div>
  );
}
