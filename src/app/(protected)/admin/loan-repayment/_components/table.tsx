"use client";
import {
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import { ColumsRepaymentFN } from "./column";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import { IApplyFilters } from "@/app/(protected)/vendors/loan-applications/page";
import FilterDrawer from "@/app/(protected)/vendors/_components/FilterDrawer";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";

const DataTable = () => {
  const onOpen = () => {};
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [status, setStatus] = useState("");
  const [tableData, setTableData] = useState(null);
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchTableData = useCallback(async () => {
    setIsLoadingTable(true);

    let query = `/admin/loan-repayment?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }

    if (createdAtStart) {
      query += `&dateFrom=${createdAtStart}`;
    }
    if (createdAtEnd) {
      query += `&dateTo=${createdAtEnd}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setTableData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoadingTable(false);
  }, [token, pageCount, debouncedSearch, createdAtStart, createdAtEnd]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const repaymentData = useMemo(
    () => tableData?.data?.data,
    [tableData?.data.data]
  );

  const table = useReactTable({
    data: repaymentData,
    columns: ColumsRepaymentFN(onOpen, pageCount),
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

  const applyFilters = (filters: IApplyFilters) => {
    setCreatedAtStart(filters.startDate);
    setCreatedAtEnd(filters.endDate);
    setStatus(filters.status);
  };

  const clearFilters = () => {
    setCreatedAtStart(null);
    setCreatedAtEnd(null);
    setStatus("");
  };

  return (
    <div>
      <Text fontSize={"1.3rem"} fontWeight={700} color={"gray.900"}>
        Loan Repayments
      </Text>

      <Flex mt={4} gap={2}>
        <SearchInput
          placeholder="Search by customer name"
          onChange={(e) => setGlobalFilter(e.target.value)}
          value={globalFilter}
        />

        <Button
          h={"40px"}
          px={4}
          variant={"outline"}
          className="border text-gray-600 bg-white"
          onClick={onOpenFilter}
        >
          Filter
        </Button>
      </Flex>

      {isLoadingTable || !repaymentData ? (
        <div className="flex justify-center mt-10">
          <Spinner size={"lg"} />
        </div>
      ) : (
        <div className="mt-5">
          {repaymentData.length === 0 ? (
            <EmptyOrder
              heading={`No Loan Yet`}
              content={`You currently have no loan repayment. All loan repayment will appear here.`}
            />
          ) : (
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
              <Pagination
                meta={tableData?.data?.meta}
                setPageCount={setPageCount}
              />
            </TableContainer>
          )}
        </div>
      )}

      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        noStatus
      />
    </div>
  );
};

export default DataTable;
