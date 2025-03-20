"use client";

import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import {
  Checkbox,
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
import { useState } from "react";
import { ColumsFN } from "./pw-columns/table";
import TransactionDetails from "./TransactionDetail";
import InitiatePayout from "./InitiatePayout";
import { ColumsCompletedFN } from "./pw-columns/CompletedTable";
import { ColumsHistoryFN } from "./pw-columns/HistoryTable";
import { Awaiting_columnFn } from "./lw-columns/awaitting_payout_column";
import { Completed_ColumnFN } from "./lw-columns/completed-payout_column";
import { History_ColumnFN } from "./lw-columns/history_column";
import Pagination from "../../products/_components/Pagination";

const WalletTable = ({
  data,
  type,
  walletType,
}: {
  data: any;
  type: string;
  walletType: "product_wallet" | "loan_wallet";
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
    if (walletType === "product_wallet") {
      return type === "completed"
        ? ColumsCompletedFN(onOpen, onOpenPayout)
        : type === "history"
        ? ColumsHistoryFN(onOpen, onOpenPayout)
        : ColumsFN(onOpen, onOpenPayout);
    }

    if (walletType === "loan_wallet") {
      return type === "completed"
        ? Completed_ColumnFN(onOpen, onOpenPayout)
        : type === "history"
        ? History_ColumnFN(onOpen, onOpenPayout)
        : Awaiting_columnFn(onOpen, onOpenPayout);
    }
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

          {/* <Pagination meta={} setPageCount={() => {}} /> */}
        </TableContainer>
      )}
      <TransactionDetails isOpen={isOpen} onClose={onClose} type="" />
      <InitiatePayout isOpen={isOpenPayout} onClose={onClosePayout} />
    </div>
  );
};

export default WalletTable;
