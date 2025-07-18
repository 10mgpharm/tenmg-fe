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
  Flex,
  Spinner,
} from "@chakra-ui/react";

import Link from "next/link";
import {
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
import EmptyCard from "../suppliers/_components/EmptyCard";

const Admin = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

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

  const columns = useMemo(() => ColumsFN(), []);
  const loanData = useMemo(() => data?.loans?.data?.slice(0, 4), [data?.loans?.data]);

  const table = useReactTable({
    data: loanData || [],
    columns: columns,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    enableRowSelection: true,
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
      type: "SALES"
    },
    {
      id: 2,
      title: "Today's Revenue",
      amount: `₦${data?.todayRevenue || 0.00}`,
      changeType: "INCREASE",
      timeStamp: " vs. last week",
      percentage: "2.35%",
      type: "REVENUE"
    },
    {
      id: 3,
      title: "Today's Order",
      amount: `${data?.todayOrder || 0}`,
      changeType: "INCREASE",
      timeStamp: " vs. last week",
      percentage: "2.35%",
      type: "ORDER"
    },
    {
      id: 4,
      title: "Ongoing Loan",
      amount: `${data?.onGoingLoans || 0}`,
      changeType: "",
      timeStamp: "",
      percentage: "",
      type: "LOAN"
    },
  ]

  return (
    <div className="p-6 sm:p-8">
      <Stack gap={4}>
        <Text fontWeight={"semibold"} fontSize={["xl", "2xl"]}>
          Dashboard
        </Text>
        <SimpleGrid columns={[1, 2, 4]} gap={3}>
          {overviewData?.map((item) => (
            <DashboardCard
              key={item.id}
              title={item.title}
              amount={item.amount}
              changeType={item.changeType}
              percentage={item.percentage}
              timeStamp={item.timeStamp}
              type={item.type}
            />
          ))}
        </SimpleGrid>
      </Stack>
      <Stack mt={6}>
        <ActivityCharts data={data} loading={loading} />
      </Stack>
      <Stack mt={6}>
        <HStack justify={"space-between"} mb={3}>
          <Text fontSize={["lg", "xl"]} fontWeight={"500"}>
            Loan Managment
          </Text>
          <Link
            href={"/admin/loan-management"}
            className="text-gray-600 text-sm px-4 py-2 font-medium bg-white border border-[#D0D5DD] rounded-md"
          >
            See All
          </Link>
        </HStack>
        <Stack bg={"white"}>
          {
            loanData?.length === 0 ? 
            (
              <EmptyCard/> 
            )
            : loanData?.length > 0 ? (
              <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                <Table className="no-scrollbar">
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
                    {table?.getRowModel()?.rows?.map((row, i) => (
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
            )
            : (
              <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
              </Flex>
            )
          }
        </Stack>
      </Stack>
    </div>
  );
};

export default Admin;
