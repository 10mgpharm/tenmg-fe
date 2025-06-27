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
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import Pagination from "../../products/_components/Pagination";

type props = {
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
  column: any;
};

const UserWallet = ({
  data,
  hasPagination = false,
  metaData,
  setPageCount,
  isLoading = false,
  column,
}: props) => {
  // table
  const table = useReactTable({
    data: data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      {isLoading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          {data?.length === 0 ? (
            <EmptyOrder
              heading={`No Wallet Yet`}
              content={`You currently have no wallet. All wallets will appear here.`}
            />
          ) : (
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
              <Table>
                <Thead bg={"#F2F4F7"}>
                  {table?.getHeaderGroups()?.map((headerGroup, index) => (
                    <Tr key={index}>
                      {headerGroup.headers?.map((header, idx) => (
                        <Th textTransform={"initial"} px="6px" key={idx}>
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
                  {table?.getRowModel()?.rows?.map((row, i) => (
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
          )}
        </>
      )}
    </div>
  );
};

export default UserWallet;
