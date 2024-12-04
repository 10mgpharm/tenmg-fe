"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchInput from "../components/SearchInput";
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
import EmptyResult from "../components/EmptyResult";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "../../suppliers/components/Pagination";
import { ColumnsCreditScoreFN } from "./components/table";
import { creditScoreData } from "@/data/mockdata";
import AffordabilityModel from "./components/AffordabilityModel";
import BusinessLogicModal from "./components/BusinessLogicModal";

const CreditScore = () => {
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);

  //   const tableData: TransactionHistoryData[] = useMemo(
  //     () => tnxHistoryData,
  //     [tnxHistoryData]
  //   );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenBusiness,
    onClose: onCloseBusiness,
    onOpen: onOpenBusiness,
  } = useDisclosure();

  const tableData = creditScoreData;

  const table = useReactTable({
    data: tableData ? tableData : [],
    columns: ColumnsCreditScoreFN(),
    state: {
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Credit Score</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <SearchInput
              placeholder="Search for a user"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <div
              // onClick={onOpenFilter}
              className="border cursor-pointer border-gray-300 p-3 rounded-md flex items-center gap-2"
            >
              <CiFilter className="w-5 h-5" />
              <p className="text-gray-500 font-medium">Filter</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" color="primary.500" onClick={onOpen}>
            Configure Affordability
          </Button>

          <Button onClick={onOpenBusiness}>Create Business Rule</Button>
        </div>
      </div>
      <div className="">
        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : tableData && tableData?.length === 0 ? (
          <EmptyResult
            heading={`Nothing to show here yet`}
            content={`You don’t have any customer yet. When you do, they’ll appear here.`}
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
                  <Td py={4} w="full" colSpan={7}>
                    <Pagination meta={tableData} setPageCount={setPageCount} />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </div>
      <AffordabilityModel isOpen={isOpen} onClose={onClose} />
      <BusinessLogicModal isOpen={isOpenBusiness} onClose={onCloseBusiness} />
    </div>
  );
};

export default CreditScore;
