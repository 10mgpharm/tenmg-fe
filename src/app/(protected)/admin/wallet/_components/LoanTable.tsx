import { useMemo, useState } from "react";
import { LoanTransactionProps } from "@/types";
import { loanColumnFn } from "./columns/loanColumn";
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
import TransactionDetails from "./TransactionDetail";
import { repaymentColumnFn } from "./columns/repaymentColumn";
import Pagination from "../../products/_components/Pagination";
// import LoanTransactionDetails from "./loanTransactionDetails";

interface LoanTableProps {
  type: string;
  hasPagination: boolean;
  pageCount?: number;
  setPageCount?: (pageCount: number) => void;
  data: LoanTransactionProps[];
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
}

const LoanTable = ({
  type,
  data,
  hasPagination,
  metaData,
  setPageCount,
}: LoanTableProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState<LoanTransactionProps>();
  const columns = useMemo(() => {
    return type === "credit"
      ? loanColumnFn(onOpen, setSelectedRow)
      : repaymentColumnFn(onOpen, setSelectedRow);
  }, [type, onOpen, selectedRow]);
  const filterTransactions = useMemo(() => data?.slice(0, 6), [data]);

  const table = useReactTable({
    data: filterTransactions || [],
    columns: columns,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      {data?.length === 0 ? (
        <EmptyOrder
          heading={`No Result Found`}
          content={`No record found for this request`}
        />
      ) : data?.length > 0 ? (
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
      ) : (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      )}
      <TransactionDetails
        selectedRow={selectedRow}
        isOpen={isOpen}
        onClose={onClose}
        type="loan-wallet"
        orderId={selectedRow?.identifier}
      />
    </div>
  );
};
export default LoanTable;
