"use client";
import SearchComponent from "@/app/(protected)/suppliers/orders/_components/SearchComponent";
import {
  Button,
  Flex,
  HStack,
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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import { repaymentData } from "@/data/mockdata";
import { ColumsRepaymentFN } from "./column";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import requestClient from "@/lib/requestClient";
import { IApplyFilters } from "@/app/(protected)/vendors/loan-applications/page";
import FilterDrawer from "@/app/(protected)/vendors/_components/FilterDrawer";

const DataTable = () => {
  const onOpen = () => {};
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

  const fetchTableData = useCallback(async () => {
    setIsLoadingTable(true);

    let query = `/admin/loan-repayment?page=${pageCount}`;

    if (status) {
      query += `&status=${status}`;
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
  }, [token, pageCount, status, createdAtStart, createdAtEnd]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const repaymentData = useMemo(() => tableData?.data, [tableData?.data]);

  const table = useReactTable({
    data: repaymentData?.data,
    columns: ColumsRepaymentFN(onOpen),
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

  const filterOptions = [
    { option: "PAID", value: "PAID" },
    { option: "PENDING", value: "PENDING" },
  ];

  const applyFilters = (filters: IApplyFilters) => {
    console.log(filters);
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
      <Flex mt={4} gap={2} justifyContent={"space-between"}>
        <Text fontSize={"1.3rem"} fontWeight={700} color={"gray.900"}>
          Loan Repayments
        </Text>

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

      {isLoadingTable ? (
        <div className="flex justify-center mt-10">
          <Spinner size={"lg"} />
        </div>
      ) : (
        <div className="mt-5">
          {!repaymentData?.data ? (
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
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default DataTable;
