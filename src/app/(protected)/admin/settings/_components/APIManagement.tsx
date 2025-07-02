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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
// import { APIData } from "@/data/mockdata";
import { ColumsAPIFN } from "../tables/apiTable";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";

const APIManagement = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [apiData, setApiData] = useState<any>({});

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const [meta, setMeta] = useState({});
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const fetchApiManagementData = async () => {
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
    };
    if (sessionData) fetchApiManagementData();
  }, [sessionData, pageCount]);

  // Fn: to revoke api
  const revokeApi = async (
    business_id: string,
    environment: "test" | "live"
  ) => {
    //     POST <<BASE_URL>>/api/v1/admin/settings/api-manage
    // payload: {
    //   “businessId”: 7,
    //   “environment”:“live” // either test or live
    // } this endpoint is to revoke an api key.
    console.log("business_id", business_id);
    try {
      const resp = await requestClient({
        token: sessionData?.user?.token,
      }).post("/admin/settings/api-manage", {
        businessId: business_id,
        environment,
      });
      console.log("resp", resp);
    } catch (error) {}
  };

  const table = useReactTable({
    data: apiData,
    columns: ColumsAPIFN(revokeApi),
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
      {apiData?.length === 0 ? (
        <EmptyOrder
          heading={`No API Yet`}
          content={`You currently have no API yet. All APIs will appear here.`}
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
        </TableContainer>
      )}
      <Pagination meta={meta} setPageCount={setPageCount} />
    </div>
  );
};

export default APIManagement;
