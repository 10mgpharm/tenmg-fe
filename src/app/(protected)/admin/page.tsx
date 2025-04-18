"use client";

import {
  SimpleGrid,
  Stack,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  HStack,
} from "@chakra-ui/react";

import Link from "next/link";
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
import { ColumsFN } from "./_components/table";
import DashboardCard from "./_components/DashboardCard";
import ActivityCharts from "./_components/ActivityCharts";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";

const Admin = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const fetchingOverview = useCallback(async () => {
      try {
        setLoading(true)
        const res = await requestClient({token: token}).get(
          `/admin/dashboard`
        )
        setData(res.data?.data);
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchingOverview();
  }, [token]);

  const loanData = data?.loans?.data?.slice(0, 4);
  const memoizedData = useMemo(() => loanData, [loanData]);

  const table = useReactTable({
    data: memoizedData,
    columns: ColumsFN(),
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

  const overviewData = [
    {
      id: 1,
      title: "Today's Sales",
      amount: `${data?.todaySales || 0}`,
      changeType: "INCREASE",
      timeStamp: " vs. last week",
      percentage: "2.35%",
    },
    {
      id: 2,
      title: "Today's Revenue",
      amount: `₦${data?.todayRevenue || 0.00}`,
      changeType: "INCREASE",
      timeStamp: " vs. last week",
      percentage: "2.35%",
    },
    {
      id: 2,
      title: "Today's Order",
      amount: `${data?.todayOrder || 0}`,
      changeType: "INCREASE",
      timeStamp: " vs. last week",
      percentage: "2.35%",
    },
    {
      id: 2,
      title: "Ongoing Loan",
      amount: `0`,
      changeType: "INCREASE",
      timeStamp: " vs. last week",
      percentage: "2.35%",
    },
  ]

  console.log(data)

  return (
    <div className="p-8">
      <Stack gap={4}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          Dashboard
        </Text>
        <SimpleGrid columns={[2, 4]} gap={3}>
          {overviewData?.map((item) => (
            <DashboardCard
              key={item.id}
              title={item.title}
              amount={item.amount}
              changeType={item.changeType}
              percentage={item.percentage}
              timeStamp={item.timeStamp}
            />
          ))}
        </SimpleGrid>
      </Stack>
      <Stack mt={6}>
        <ActivityCharts data={data} loading={loading} />
      </Stack>
      <Stack mt={6}>
        <HStack justify={"space-between"} mb={3}>
          <Text fontSize={"xl"} fontWeight={"500"}>
            Loan Managment
          </Text>
          <Link
            href={"/admin/loan-management"}
            className="text-gray-600 text-sm px-4 py-2 font-medium bg-white border border-[#D0D5DD] rounded-md"
          >
            View all
          </Link>
        </HStack>
        <Stack bg={"white"}>
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
            <Table>
              <Thead bg={"#F2F4F7"}>
                {table?.getHeaderGroups()?.map((headerGroup, i) => (
                  <Tr key={i}>
                    {headerGroup.headers?.map((header, i) => (
                      <Th textTransform={"initial"} px="0px" key={i}>
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
              <Tbody color="#606060" fontSize={"14px"}>
                {memoizedData && table?.getRowModel()?.rows?.map((row, i) => (
                  <Tr key={i}>
                    {row.getVisibleCells()?.map((cell, i) => (
                      <Td key={i} px="0px">
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
        </Stack>
      </Stack>
    </div>
  );
};

export default Admin;
