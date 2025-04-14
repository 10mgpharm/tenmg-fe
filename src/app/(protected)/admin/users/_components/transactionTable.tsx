"use client";

import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
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
import { Dispatch, SetStateAction, useState } from "react";
import Pagination from "../../products/_components/Pagination";
import TransactionDetails from "../../wallet/_components/TransactionDetail";
import { TransactionColumn } from "./columns/TransactionColum";
import Pharm_TransactionDetailss from "./PharmacyTransactionDetails";

const TransactionTable = ({
  data,
  hasPagination = false,
  metaData,
  setPageCount,
  isLoading = false,
}: {
  data: any;
  hasPagination?: boolean;
  metaData?: {
    links: any;
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    currentPage: number;
    firstPageUrl: any;
    lastPageUrl: any;
  };
  setPageCount?: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  // table
  const table = useReactTable({
    data: data,
    columns: TransactionColumn(onOpen),
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

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <div>
      {data?.length === 0 ? (
        <EmptyOrder
          heading={`No History Yet`}
          content={`No transaction has been made by this user. All transactions will appear here.`}
        />
      ) : (
        <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
          <Table>
            <Thead bg={"#F2F4F7"}>
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers?.map((header) => (
                    <Th textTransform={"initial"} px="6px" key={header.id}>
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
                    <Td key={cell.id} px="6px">
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

          {hasPagination && metaData && setPageCount && (
            <Pagination {...metaData} setPageCount={setPageCount} />
          )}
        </TableContainer>
      )}
      <Pharm_TransactionDetailss isOpen={isOpen} onClose={onClose} type="" />
    </div>
  );
};

export default TransactionTable;
