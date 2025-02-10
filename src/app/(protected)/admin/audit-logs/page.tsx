"use client";

import { useState, useEffect, useMemo } from "react";
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
import { NextAuthUserSession } from "@/types";
import Pagination from "../products/_components/Pagination";

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  useEffect(() => {
    const fetchData = async (page: number) => {
      setLoading(true);
      setError("");
      try {
        const response = await requestClient({ token }).get(
          `admin/settings/audit-logs?page=${page}&limit=${ITEMS_PER_PAGE}`
        );

        if (response.status === 200 && response.data.data) {
          setData(response.data.data.records || []);
          setTotalItems(response.data.data.total || 0);
        } else {
          setError("Failed to load audit logs. Please try again.");
        }
      } catch (err: any) {
        console.error(err);
        setError("An unexpected error occurred while fetching audit logs.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData(currentPage);
    }
  }, [token, currentPage]);

  const table = useReactTable({
    data,
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

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Audit Logs</h2>
      <SearchComponent placeholder="Search" />
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

        {!loading && !error && data.length === 0 && (
          <EmptyOrder
            heading={`No Audit Logs Yet`}
            content={`You currently have no audit logs. All audit logs will appear here.`}
          />
        )}

        {!loading && !error && data.length > 0 && (
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
            <Table>
              <Thead bg={"#F2F4F7"}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers?.map((header) => (
                      <Th textTransform={"initial"} px="0px" key={header.id}>
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
              </Tbody>
            </Table>
          </TableContainer>
        )}
        {data?.length > 0 && (
          <Pagination
            links={[
              ...(currentPage > 1 && data.length > 0
                ? [
                    {
                      url: `?page=${currentPage - 1}`,
                      label: "Previous",
                      active: false,
                    },
                  ]
                : []),
              ...Array.from({ length: totalPages }, (_, i) => ({
                label: (i + 1).toString(),
                url: `?page=${i + 1}`,
                active: currentPage === i + 1,
              })),
              ...(currentPage < totalPages && data.length > 0
                ? [
                    {
                      url: `?page=${currentPage + 1}`,
                      label: "Next",
                      active: false,
                    },
                  ]
                : []),
            ]}
            setPageCount={setCurrentPage}
            prevPageUrl={
              currentPage > 1 && data.length > 0
                ? `?page=${currentPage - 1}`
                : null
            }
            nextPageUrl={
              currentPage < totalPages && data.length > 0
                ? `?page=${currentPage + 1}`
                : null
            }
            currentPage={currentPage}
            firstPageUrl={data.length > 0 ? `?page=1` : null}
            lastPageUrl={data.length > 0 ? `?page=${totalPages}` : null}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
