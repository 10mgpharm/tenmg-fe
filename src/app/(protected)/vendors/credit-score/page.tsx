"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchInput from "../_components/SearchInput";
import {
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import EmptyResult from "../_components/EmptyResult";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "../../suppliers/_components/Pagination";
import { ColumnsCreditScoreFN } from "./_components/table";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import {
  CreditScoreData,
  CreditScoreResponseData,
  NextAuthUserSession,
} from "@/types";
import { useDebouncedValue } from "@/utils/debounce";

export interface IFilterInput {
  endDate?: Date | null;
  startDate?: Date | null;
  status?: string;
}

const CreditScore = () => {
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [creditScoreData, setCreditScoreData] = useState(null);

  const debouncedSearch = useDebouncedValue(globalFilter, 500);
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const fetchCreditScore = useCallback(async () => {
    setLoading(true);
    let query = `/vendor/txn_history/get-all-creditscore?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setCreditScoreData(response?.data?.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch]);

  useEffect(() => {
    if (!token) return;
    fetchCreditScore();
  }, [token, fetchCreditScore]);

  const tableData: CreditScoreData[] = useMemo(
    () => creditScoreData?.data,
    [creditScoreData]
  );

  const tablePagination: CreditScoreResponseData = useMemo(
    () => creditScoreData?.meta || [],
    [creditScoreData]
  );

  const table = useReactTable({
    data: tableData ?? [],
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
              placeholder="Search"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="">
        {!loading ? (
          tableData?.length !== 0 ? (
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
                      <Pagination
                        meta={tablePagination}
                        setPageCount={setPageCount}
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyResult
              heading={`Nothing to show here`}
              content={`Record Not Found!
              No credit score found for your search`}
            />
          )
        ) : (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )}
      </div>

      {/* <AffordabilityModel isOpen={isOpen} onClose={onClose} />
      <BusinessLogicModal isOpen={isOpenBusiness} onClose={onCloseBusiness} /> */}
    </div>
  );
};

export default CreditScore;
