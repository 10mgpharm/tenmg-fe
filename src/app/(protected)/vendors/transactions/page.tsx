"use client";

import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import {
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ColumnsTransactionFN } from "./components/table";
import FilterDrawer from "./components/FilterDrawer";
import Pagination from "../../suppliers/components/Pagination";
import SearchInput from "../components/SearchInput";
import EmptyResult from "../components/EmptyResult";

interface IFormInput {
  endDate?: Date | null;
  startDate?: Date | null;
  status?: string;
}

const Transactions = () => {
  const [pageCount, setPageCount] = useState<number>(1);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const data = [
    {
      ref: "EVAL-20241030-1624-29404",
      customer: "Olivia Rhye",
      phone: "+234-708-934-9832",
      date: "Jan 6, 2024",
      sources: "EXCEL",
      email: "olivia@gmail.com",
      active: 1,
      action: "RETRY",
    },
    {
      ref: "EVAL-20241030-1624-29404",
      customer: "Olivia Rhye",
      phone: "+234-708-934-9832",
      date: "Jan 6, 2024",
      sources: "JSON",
      email: "olivia@gmail.com",
      active: 0,
      action: "VIEW",
    },
    {
      ref: "EVAL-20241030-1624-29404",
      customer: "Olivia Rhye",
      phone: "+234-708-934-9832",
      date: "Jan 6, 2024",
      sources: "Excel",
      email: "olivia@gmail.com",
      active: 1,
      action: "RETRY",
    },
    {
      ref: "EVAL-20241030-1624-29404",
      customer: "Olivia Rhye",
      phone: "+234-708-934-9832",
      date: "Jan 6, 2024",
      sources: "Excel",
      email: "olivia@gmail.com",
      active: 1,
      action: "RETRY",
    },
    {
      ref: "EVAL-20241030-1624-29404",
      customer: "Olivia Rhye",
      phone: "+234-708-934-9832",
      date: "Jan 6, 2024",
      sources: "Excel",
      email: "olivia@gmail.com",
      active: 1,
      action: "RETRY",
    },
    {
      ref: "EVAL-20241030-1624-29404",
      customer: "Olivia Rhye",
      phone: "+234-708-934-9832",
      date: "Jan 6, 2024",
      sources: "JSON",
      email: "olivia@gmail.com",
      active: 0,
      action: "VIEW",
    },
    {
      ref: "EVAL-20241030-1624-29404",
      customer: "Olivia Rhye",
      phone: "+234-708-934-9832",
      date: "Jan 6, 2024",
      sources: "JSON",
      email: "olivia@gmail.com",
      active: 0,
      action: "VIEW",
    },
  ];

  const table = useReactTable({
    data: data,
    columns: ColumnsTransactionFN(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Transaction History</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <SearchInput placeholder="Search for a Transaction Evaluation" />
            <div
              onClick={onOpenFilter}
              className="border cursor-pointer border-gray-300 p-3 rounded-md flex items-center gap-2"
            >
              <CiFilter className="w-5 h-5" />
              <p className="text-gray-500 font-medium">Filter</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button>Evaluate Transaction History</Button>
        </div>
      </div>
      <div className="">
        {data && data?.length === 0 ? (
          <EmptyResult
            heading={`Nothing to show here yet`}
            content={`You don’t have any transactions yet. When you do, they’ll appear here.`}
          />
        ) : (
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
            <Table>
              <Thead bg={"blue.50"}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
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
                {table?.getRowModel()?.rows?.map((row) => (
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
                <Tr>
                  <Td py={4} w="full" colSpan={6}>
                    {/* <Pagination meta={tableData} setPageCount={setPageCount} /> */}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Transactions;
