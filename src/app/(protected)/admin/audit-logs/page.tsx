"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import SearchComponent from "../../suppliers/orders/_components/SearchComponent";
import EmptyOrder from "../../suppliers/orders/_components/EmptyOrder";
import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { ColumsLogFN } from "./_components/table";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { AuditLogsResponse, NextAuthUserSession } from "@/types";
import Pagination from "../../suppliers/_components/Pagination";
import { useDebouncedValue } from "@/utils/debounce";

const Page = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [data, setData] = useState<AuditLogsResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearch = useDebouncedValue(searchValue, 500);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    let query = `/admin/settings/audit-logs?page=${pageCount}&limit=${10}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [token, pageCount, debouncedSearch]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const table = useReactTable({
    data: data?.data,
    columns: ColumsLogFN(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const meta = {
    links: data?.links,
    currentPage: data?.currentPage,
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Audit Logs</h2>
      <SearchComponent
        placeholder="Search by name or action"
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <div className="mt-5">
        {loading && (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )}

        {error && !loading && (
          <Center mt={10}>
            <Text color="red.500">{error}</Text>
          </Center>
        )}

        {!loading && !error && data?.data.length === 0 && (
          <EmptyOrder
            heading={searchValue ? "No Matching Results" : "No Audit Logs Yet"}
            content={
              searchValue
                ? `No audit log found for the user name or action "${searchValue}".`
                : `You currently have no audit logs. All audit logs will appear here.`
            }
          />
        )}

        {!loading && !error && data?.data.length > 0 && (
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
            <Table>
              <Thead bg={"#F2F4F7"}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers?.map((header) => (
                      <Th textTransform={"initial"} px="16px" key={header.id}>
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
                      <Td key={cell.id} px="16px">
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
            <Pagination meta={meta} setPageCount={setPageCount} />
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Page;
