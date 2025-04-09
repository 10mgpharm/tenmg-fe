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
import TransactionDetails from "./TransactionDetail";
import InitiatePayout from "./InitiatePayout";
import { Awaiting_columnFn } from "./columns/awaitting_payout_column";
import { Completed_ColumnFN } from "./columns/completed-payout_column";
import { History_ColumnFN } from "./columns/history_column";
import Pagination from "../../products/_components/Pagination";

const WalletTable = ({
  data,
  type,
  walletType,
  hasPagination = false,
  metaData,
  setPageCount,
  isLoading = false,
}: {
  data: any;
  type: string;
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
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenPayout,
    onOpen: onOpenPayout,
    onClose: onClosePayout,
  } = useDisclosure();

  // Get selected column
  const getSelectColumn = () => {
    return type === "completed"
      ? Completed_ColumnFN(walletType, onOpen, onOpenPayout)
      : type === "history"
      ? History_ColumnFN(walletType, onOpen, onOpenPayout)
      : Awaiting_columnFn(walletType, onOpen, onOpenPayout);
  };

  // table
  const table = useReactTable({
    data: data,
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
      {data?.length === 0 ? (
        <EmptyOrder
          heading={`No Wallet Yet`}
          content={`You currently have no wallet. All wallets will appear here.`}
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
      <TransactionDetails isOpen={isOpen} onClose={onClose} type="" />
      <InitiatePayout
        isOpen={isOpenPayout}
        onClose={onClosePayout}
        walletType={walletType}
      />
    </div>
  );
};

export default WalletTable;
