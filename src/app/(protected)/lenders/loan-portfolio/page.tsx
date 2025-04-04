"use client";

import {
  Badge,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TransactionHistoryDrawer from "../_components/TransactionHistoryDrawer";
import WalletDrawer from "../_components/WalletDrawer";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import SearchInput from "../../vendors/_components/SearchInput";
import LenderEmptyScreen from "../_components/EmptyScreen";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ColumnsLoanApplicationFN } from "./_components/table";
import {
  CustomerRecords,
  LoanDataProp,
  NextAuthUserSession,
} from "@/types";
import { useSession } from "next-auth/react";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import Pagination from "../../suppliers/_components/Pagination";
import { formatAmount } from "@/utils/formatAmount";
export default function TransactionWalletPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  
  const [loanApplication, setLoanApplication] =
    useState<LoanDataProp | null>(null);

  const [loanStats, setLoanStats] = useState<any | null>(null);

  const [allCustomers, setAllCustomers] = useState<CustomerRecords[]>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();
  const {
    isOpen: isOpenSend,
    onClose: onCloseSend,
    onOpen: onOpenSend,
  } = useDisclosure();

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [pageCount, setPageCount] = useState<number>(1);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    let query = `/lender/loan?page=${pageCount}`;

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
        setLoanApplication(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch, status, createdAtStart, createdAtEnd]);

  const fetchLoanStats = useCallback(async () => {
    setLoading(true);

    try {
      const response = await requestClient({ token: token }).get(
        `/lender/loan/stats`
      );
      if (response.status === 200) {
        setLoanStats(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token]);

  const tableData = useMemo(
    () => loanApplication?.data,
    [loanApplication?.data]
  );

  useEffect(() => {
    if (!token) return;
    fetchLoans();
    fetchLoanStats();
  }, [fetchLoans, fetchLoanStats, token]);

  const applyFilters = (filters) => {
    setCreatedAtStart(filters.startDate);
    setCreatedAtEnd(filters.endDate);
    setStatus(filters.status);
  };

  const clearFilters = () => {
    setCreatedAtStart(null);
    setCreatedAtEnd(null);
    setStatus("");
    setGlobalFilter("");
  };

  const table = useReactTable({
    data: tableData ?? [],
    columns: ColumnsLoanApplicationFN(),
    state: {
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filterOptions = [
    { option: "APPROVED", value: "APPROVED" },
    { option: "INITIATED", value: "INITIATED" },
    { option: "EXPIRED", value: "EXPIRED" },
  ];

  const card_info = [
    {
      title: "Active Loan",
      value: loanStats ? loanStats?.activeLoan : 0,
      bgColor: "#53389E",
      bgImg: "/assets/images/disb_bg.png",
    },
    {
      title: "Total Loan Amount",
      value: loanStats ? formatAmount(loanStats?.totalLoans) : "₦0",
      bgColor: "#DC6803",
      bgImg: "/assets/images/app_bg.png",
    },
    {
      title: "Pending Repayment",
      value: loanStats ? formatAmount(loanStats?.pendingRepayment) : "₦0",
      bgColor: "#3E4784",
      bgImg: "/assets/images/pend_bg.png",
    },
    {
      title: "Completed Loan",
      value: loanStats ? loanStats?.completedRepayment : "0",
      bgColor: "#E31B54",
      bgImg: "/assets/images/tot_bg.png",
    },
  ];

  return (
    <div className="px-4">
      <h4 className="text-xl font-bold my-4">Loan Portfolio</h4>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {card_info.map((item, index) => (
          <div
            key={index}
            className="relative h-32 bg-cover bg-center bg-no-repeat rounded-lg p-4 flex items-center"
            style={{
              backgroundImage: `url(${item.bgImg})`,
            }}
          >
            <div
              className="absolute inset-0  bg-opacity-10 rounded-md"
              style={{ backgroundColor: item.bgColor }}
            ></div>

            {/* Card Content */}
            <div className="relative z-10 text-white">
              <h4 className="text-sm font-medium">{item.title}</h4>
              <p className="text-base font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="my-8">
        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : tableData && tableData?.length === 0 ? (
          <LenderEmptyScreen
            heading="Nothing to show here yet"
            content="You don’t have a loan in your portfolio yet, when you do, they’ll appear here."
          />
        ) : (
          <>
            <div className="flex items-center gap-3 my-5">
              <SearchInput
                placeholder="Search for Borrower's name/Loan ID"
                // value={globalFilter}
                // onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <Menu>
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
                <MenuList>
                  {/* <MenuItem>By Date</MenuItem>
                <MenuItem>Credit Score</MenuItem>
                <MenuItem>Vendor Name</MenuItem> */}
                </MenuList>
              </Menu>
            </div>
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
              <Table>
                <Thead bg={"blue.50"}>
                  {tableData &&
                    table?.getHeaderGroups()?.map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers?.map((header) => (
                          <Th
                            textTransform={"initial"}
                            px="0px"
                            key={header.id}
                            color={"primary.500"}
                            fontWeight={"500"}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                </Thead>
                <Tbody bg={"white"} color="#606060" fontSize={"14px"}>
                  {tableData?.length &&
                    table?.getRowModel()?.rows?.map((row) => (
                      <Tr key={row.id}>
                        {row.getVisibleCells()?.map((cell) => (
                          <Td key={cell.id} px="0px">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              <Pagination meta={tableData} setPageCount={setPageCount} />
            </TableContainer>
          </>
        )}
      </div>
    </div>
  );
}

export const TH_table_data = [
  {
    id: "10MG-LN001",
    name: "Olivia Rhye",
    date: "Aug 21, 2024",
    amount: "₦1,300,000",
    end_date: "Aug 21, 2024",
    outstanding_amount: "₦1,300,000",
    // type: "Deposit",
    status: "Completed",
  },
  {
    id: "10MG-LN001",
    name: "Olivia Rhye",
    date: "Aug 21, 2024",
    amount: "₦1,300,000",
    end_date: "Aug 21, 2024",
    outstanding_amount: "₦1,300,000",
    // type: "Deposit",
    status: "Completed",
  },
  {
    id: "10MG-LN001",
    name: "Olivia Rhye",
    date: "Aug 21, 2024",
    amount: "₦1,300,000",
    end_date: "Aug 21, 2024",
    outstanding_amount: "₦1,300,000",
    // type: "Deposit",
    status: "Completed",
  },
  {
    id: "10MG-LN001",
    name: "Olivia Rhye",
    date: "Aug 21, 2024",
    amount: "₦1,300,000",
    end_date: "Aug 21, 2024",
    outstanding_amount: "₦1,300,000",
    // type: "Deposit",
    status: "Completed",
  },
];
