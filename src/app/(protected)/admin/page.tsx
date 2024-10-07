"use client";

import { 
    Avatar, 
    Divider, 
    Flex, 
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
    HStack
 } from "@chakra-ui/react"
import DashboardCard from "./components/DashboardCard"
import salesIcon from '@public/assets/images/Emphasis.svg'
import pharmIcon from '@public/assets/images/Emphasis1.svg'
import productIcon from '@public/assets/images/Emphasis2.svg'
import categoryIcon from '@public/assets/images/Emphasis3.svg'
import Image from "next/image"
import Link from "next/link"
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from "@tanstack/react-table"
import { ColumsFN } from "./components/table"
import { useState } from "react"
import { loanData, records } from "@/data/mockdata"

const Admin = () => {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // const memoizedData = useMemo(() => data, [data]);

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
            <Text fontWeight={"semibold"} fontSize={"2xl"}>Dashboard</Text>
            <SimpleGrid columns={[2, 4]} gap={3}>
                {
                    records.map((item) => (
                        <DashboardCard 
                        key={item.id} 
                        title={item.title} 
                        amount={item.amount} 
                        changeType={item.changeType} 
                        percentage={item.percentage} 
                        timeStamp={item.timeStamp}
                        />
                    ))
                }
            </SimpleGrid>
        </Stack>
        <Flex mt={6} gap={5}>
            <Stack flex={1} bg={"white"} px={6} py={3} borderRadius={"10px"} border={"1px solid #EAECF0"}>
                <Text fontWeight={"600"} mb={3} fontSize={"large"}>Store Statistics</Text>
                <Stack gap={4}>
                    <Flex justify={"space-between"}>
                        <Stack>
                            <Text color={"gray.500"}>Sales</Text>
                            <Text fontSize={"large"} fontWeight={"600"}>1,784</Text>
                        </Stack>
                        <Image src={salesIcon} alt=""/>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Stack>
                            <Text color={"gray.500"}>Pharmacist</Text>
                            <Text fontSize={"large"} fontWeight={"600"}>1,784</Text>
                        </Stack>
                        <Image src={pharmIcon} alt=""/>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Stack>
                            <Text color={"gray.500"}>Products</Text>
                            <Text fontSize={"large"} fontWeight={"600"}>164</Text>
                        </Stack>
                        <Image src={productIcon} alt=""/>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Stack>
                            <Text color={"gray.500"}>Categories</Text>
                            <Text fontSize={"large"} fontWeight={"600"}>65</Text>
                        </Stack>
                        <Image src={categoryIcon} alt=""/>
                    </Flex>
                </Stack>
            </Stack>
            <Stack flex={1} bg={"white"} borderRadius={"10px"} border={"1px solid #EAECF0"}>
                <Flex justify={"space-between"} px={5} py={3}>
                    <Text fontWeight={"600"}>New Pharmacies</Text>
                    <Link href={'#'} className="text-primary-600 text-sm">View All</Link>
                </Flex>
                <Divider />
                <Stack>
                    <Flex align={"center"} px={5} gap={2}>
                        <Avatar size={"sm"} colorScheme={"green"} name="Chidi Victor"/>
                        <Stack gap={0.5}>
                            <Text fontWeight={"500"}>Chudi Victor</Text>
                            <Text fontSize={"14px"} color={"gray.500"}>info@softeni.com</Text>
                        </Stack>
                    </Flex>
                    <Divider />
                </Stack>
                <Stack>
                    <Flex align={"center"} py={2} px={5} gap={2}>
                        <Avatar size={"sm"} colorScheme={"green"} name="Chidi Victor"/>
                        <Stack gap={0.5}>
                            <Text fontWeight={"500"}>Chudi Victor</Text>
                            <Text fontSize={"14px"} color={"gray.500"}>info@softeni.com</Text>
                        </Stack>
                    </Flex>
                    <Divider />
                </Stack>
                <Stack>
                    <Flex align={"center"} py={2} px={5} gap={2}>
                        <Avatar size={"sm"} colorScheme={"green"} name="Chidi Victor"/>
                        <Stack gap={0.5}>
                            <Text fontWeight={"500"}>Chudi Victor</Text>
                            <Text fontSize={"14px"} color={"gray.500"}>info@softeni.com</Text>
                        </Stack>
                    </Flex>
                    <Divider />
                </Stack>
                <Stack>
                    <Flex align={"center"} py={2} px={5} gap={2}>
                        <Avatar size={"sm"} colorScheme={"green"} name="Chidi Victor"/>
                        <Stack gap={0.5}>
                            <Text fontWeight={"500"}>Chudi Victor</Text>
                            <Text fontSize={"14px"} color={"gray.500"}>info@softeni.com</Text>
                        </Stack>
                    </Flex>
                    <Divider />
                </Stack>
            </Stack>
        </Flex>
        <Stack mt={8}>
            <HStack justify={"space-between"} mb={3}>
                <Text fontSize={"xl"} fontWeight={"500"}>Loan Managment</Text>
                <Link href={'/dashboard/loans'} className="text-gray-600 text-sm px-4 py-2 font-medium bg-white border border-[#D0D5DD] rounded-md">View all</Link>
            </HStack>
            <Stack bg={"white"}>
                <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                    <Table>
                        <Thead bg={"#F2F4F7"}>
                        {table?.getHeaderGroups()?.map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                            {headerGroup.headers?.map((header) => (
                                <Th
                                textTransform={"initial"}
                                px="0px"
                                key={header.id}
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
  )
}

export default Admin