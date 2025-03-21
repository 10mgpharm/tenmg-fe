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
import { useState } from "react";
import { loanData, records } from "@/data/mockdata";
import { ColumsFN } from "./_components/table";
import DashboardCard from "./_components/DashboardCard";
import ActivityCharts from "./_components/ActivityCharts";

const Admin = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: loanData,
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

  return (
    <div className="p-8">
      <Stack gap={4}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          Dashboard
        </Text>
        <SimpleGrid columns={[2, 4]} gap={3}>
          {records.map((item) => (
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
        <ActivityCharts />
      </Stack>
      <Stack mt={6}>
        <HStack justify={"space-between"} mb={3}>
          <Text fontSize={"xl"} fontWeight={"500"}>
            Loan Managment
          </Text>
          <Link
            href={"/dashboard/loans"}
            className="text-gray-600 text-sm px-4 py-2 font-medium bg-white border border-[#D0D5DD] rounded-md"
          >
            View all
          </Link>
        </HStack>
        <Stack bg={"white"}>
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
              <Tbody color="#606060" fontSize={"14px"}>
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
        </Stack>
      </Stack>
    </div>
  );
};

export default Admin;
