"use client";
import { useState, useEffect } from "react";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import {
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ColumsAPIFN } from "../tables/apiTable";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import ConfirmActionModal from "./ConfirmActionModal";
import { toast } from "react-toastify";

const APIManagement = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [apiData, setApiData] = useState<any>({});
  const [confirmAction, setConfirmAction] = useState(false);
  const [businessData, setBusinessData] = useState<{
    businessId: number;
    secret: string;
    key: string;
  }>();
  const [revokingApi, setRevokingApi] = useState(false);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const [meta, setMeta] = useState({});
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApiManagementData = async () => {
    setIsLoading(true);
    try {
      const response = await requestClient({
        token: sessionData?.user?.token,
      }).get(`/admin/settings/api-manage?page=${pageCount}&limit=10`);

      setApiData(response?.data?.data?.data);
      const meta = {
        links: response.data.data.links,
        currentPage: response.data.data.currentPage,
      };
      setMeta(meta);
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (sessionData) fetchApiManagementData();
  }, [sessionData, pageCount]);

  // Fn: to revoke api
  const revokeApi = async () => {
    setRevokingApi(true);
    try {
      const { status } = await requestClient({
        token: sessionData?.user?.token,
      }).post("/admin/settings/api-manage", {
        ...businessData,
        environment: "live",
      });
      if (status === 200) {
        toast.success("Api revoked successfully");
        fetchApiManagementData();
        setBusinessData(null);
        setConfirmAction(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }

    setRevokingApi(false);
  };

  const table = useReactTable({
    data: apiData,
    columns: ColumsAPIFN(setBusinessData, setConfirmAction, pageCount),
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
    <div className="w-full">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Spinner size={"sm"} />
        </div>
      ) : !isLoading && apiData?.length === 0 ? (
        <EmptyOrder
          heading={`No API Yet`}
          content={`You currently have no API yet. All APIs will appear here.`}
        />
      ) : (
        <TableContainer
          border="1px solid #F9FAFB"
          borderRadius="10px"
          overflowX="auto"
          maxWidth="100%"
          width={"100%"}
        >
          <Table className="w-full">
            <Thead bg="#F2F4F7">
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers?.map((header) => (
                    <Th
                      key={header.id}
                      textTransform="initial"
                      pl="20px"
                      minWidth="120px"
                      width={`${100 / headerGroup.headers.length}%`} // ✅ Safe, defined inline
                    >
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
            <Tbody bg="white" color="#606060" fontSize="14px">
              {table?.getRowModel()?.rows?.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells()?.map((cell, idx, cells) => (
                    <Td
                      key={cell.id}
                      minWidth="120px"
                      width={`${100 / cells.length}%`} // ✅ Use cells.length here
                    >
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
          <Pagination meta={meta} setPageCount={setPageCount} />
        </TableContainer>
      )}

      {confirmAction && (
        <ConfirmActionModal
          open={confirmAction}
          close={() => {
            setConfirmAction(false);
            setBusinessData(null);
          }}
          continueAction={revokeApi}
          isLoading={revokingApi}
        />
      )}
    </div>
  );
};

export default APIManagement;
