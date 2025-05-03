"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import TimeLineSelector from "../_components/TimeLineSelector";
import {
  useDisclosure,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { LoanTransactionDataProps, LoanTransactionProps, NextAuthUserSession } from "@/types";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { loanColumnFn } from "../_components/columns/loanColumn";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import TransactionDetails from "../_components/TransactionDetail";
import Pagination from "../../products/_components/Pagination";

const LoanWallet = () => {

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [pageCount, setPageCount] = useState(1);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [status, setStatus] = useState("");
  const [dataType, setDataType] = useState<
    "awaiting" | "completed" | "history"
  >("awaiting");
  const [tableData, setTableData] = useState<LoanTransactionDataProps>();
  const [selectedRow, setSelectedRow] = useState<LoanTransactionProps>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchTableData = useCallback(async () => {
    setIsLoadingTable(true);
    let query = `/admin/wallet/transactions?page=${pageCount}`;
    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }
    // if (status) {
    //   query += `&status=${status}`;
    // }
    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setTableData(response.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoadingTable(false);
  }, [token, pageCount, debouncedSearch, status]);

  useEffect(() => {
    if(!token) return;
    fetchTableData();
  }, [fetchTableData, token]);

  const memoizedData = useMemo(() => tableData?.data, [tableData?.data]);

  const table = useReactTable({
    data: memoizedData,
    columns: loanColumnFn(onOpen, setSelectedRow),
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
});

  console.log(tableData);

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
      {memoizedData?.length === 0 ? (
        <EmptyOrder
          heading={`No Wallet Yet`}
          content={`You currently have no wallet. All wallets will appear here.`}
        />
      ) : memoizedData?.length > 0 ? (
        <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
          <Table>
            <Thead bg={"#F2F4F7"}>
              {table?.getHeaderGroups()?.map((headerGroup, index) => (
                <Tr key={index}>
                  {headerGroup.headers?.map((header, idx) => (
                    <Th textTransform={"initial"} px="6px" key={idx}>
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
              {table?.getRowModel()?.rows?.map((row, i) => (
                <Tr key={i}>
                  {row.getVisibleCells()?.map((cell, ix) => (
                    <Td key={ix} px="6px">
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

          <Pagination {...tableData?.meta} setPageCount={setPageCount} />
        </TableContainer>
      ): (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      )}
      <TransactionDetails 
      selectedRow={selectedRow} 
      isOpen={isOpen} 
      onClose={onClose} 
      type="" 
      />
    </div>
    </div>
  );
};

export default LoanWallet;
