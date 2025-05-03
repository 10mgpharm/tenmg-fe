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
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useMemo } from "react";
import TransactionDetails from "./TransactionDetail";
import InitiatePayout from "./InitiatePayout";
import Pagination from "../../products/_components/Pagination";
import { Payouts } from "@/types";
import { Completed_ColumnFN } from "./columns/completed-payout_column";
import { Awaiting_columnFn } from "./columns/payout_column";

const TransactionTab = ({
  data,
  type,
  walletType,
  hasPagination = false,
  metaData,
  setPageCount,
  isLoading = false,
  emptyStateHeader,
}: {
  data: Payouts;
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
    total: number;
    perPage: number;
    from: number;
    to: number;
    lastPage: number;
  };
  setPageCount?: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
  emptyStateHeader: string;
}) => {
 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenPayout,
    onOpen: onOpenPayout,
    onClose: onClosePayout,
  } = useDisclosure();

  // Get selected column
  const getSelectColumn = () => {
    return type === "transaction"
      ? Completed_ColumnFN( onOpen, onOpenPayout)
      : Awaiting_columnFn( onOpen, onOpenPayout);
  };

  const prevData = hasPagination ? data?.data : data?.data?.slice(0, 5);
  const memoizedData = useMemo(() => prevData, [prevData]);
  // table
  const table = useReactTable({
    data: memoizedData,
    columns: getSelectColumn(),
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      {data?.data?.length === 0 ? (
        <EmptyOrder
          heading={emptyStateHeader}
          content={`All data will appear here.`}
        />
      ) : data?.data?.length > 0 ? (
        <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
          <Table>
            <Thead bg={"#F2F4F7"}>
              {table?.getHeaderGroups()?.map((headerGroup, idx) => (
                <Tr key={idx}>
                  {headerGroup.headers?.map((header, index) => (
                    <Th textTransform={"initial"} px="6px" key={index}>
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
                table?.getRowModel()?.rows?.map((row, i) => (
                  <Tr key={i}>
                    {row.getVisibleCells()?.map((cell, ix) => (
                      <Td key={ix} px="6px">
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
      ) : (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      )
    }
      <TransactionDetails isOpen={isOpen} onClose={onClose} type="" />
      <InitiatePayout
        isOpen={isOpenPayout}
        onClose={onClosePayout}
        walletType={walletType}
      />
    </div>
  );
};

export default TransactionTab;
