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
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import TransactionDetails from "./TransactionDetail";
import InitiatePayout from "./InitiatePayout";
import { History_ColumnFN } from "./columns/history_column";
import Pagination from "../../products/_components/Pagination";
import { TransactionDataProps, TransactionProps } from "@/types";
import { Payout_columnFn } from "./columns/payout_column";

const WalletTable = ({
  data,
  type,
  walletType,
  hasPagination = false,
  metaData,
  setPageCount,
  isLoading = false,
  emptyStateHeader,
}: {
  data: TransactionDataProps;
  type: "history" | "payout";
  walletType?: "product_wallet" | "loan_wallet";
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
  emptyStateHeader: string;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [userId, setUserId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenPayout,
    onOpen: onOpenPayout,
    onClose: onClosePayout,
  } = useDisclosure();

  // Get selected column
  const getSelectColumn = () => {
    return type === "history"
      ? History_ColumnFN(walletType, onOpen, onOpenPayout, setUserId)
      : Payout_columnFn(walletType, onOpen, onOpenPayout);
  };

  const memoizedData = useMemo(() => data?.data?.slice(0, 5), [data]);

  // table
  const table = useReactTable({
    data: memoizedData,
    columns: getSelectColumn(),
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
      {data?.data?.length === 0 ? (
        <EmptyOrder
          heading={emptyStateHeader}
          content={`All data will appear here.`}
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
              {memoizedData?.length > 0 &&
                table?.getRowModel()?.rows?.map((row) => (
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

      <TransactionDetails isOpen={isOpen} onClose={onClose} userId={userId} />

      <InitiatePayout
        isOpen={isOpenPayout}
        onClose={onClosePayout}
        walletType={walletType}
      />
    </div>
  );
};

export default WalletTable;
