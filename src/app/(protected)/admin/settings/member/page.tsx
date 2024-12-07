"use client";
import { 
    Box, 
    Flex, 
    HStack, 
    Input, 
    InputGroup, 
    InputLeftElement, 
    Select, 
    SimpleGrid, 
    Stack, 
    Tag, 
    Text,
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Th, 
    Thead, 
    Tr,
} from "@chakra-ui/react";
import { MoveLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from 'react'
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import EmptyOrder from '@/app/(protected)/suppliers/orders/_components/EmptyOrder';
import { activityData } from "@/data/mockdata";
import { ColumsActivityFN } from "../tables/activitiesTable";

const MemberPage = () => {
    const router = useRouter();
    // const { onOpen, onClose, isOpen } = useDisclosure();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // const memoizedData = useMemo(() => data, [data]);

    const table = useReactTable({
        data: activityData,
        columns: ColumsActivityFN(),
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
        <Flex gap={2} onClick={() => router.back()} cursor={"pointer"}>
            <MoveLeft className="w-5 h-auto text-gray-600" />
            <Text>Back</Text>
        </Flex>
        <HStack mt={5} justify={"space-between"}>
            <Stack>
                <Text fontWeight={500}>John Ajayi</Text>
                <Tag bg={"green.600"} color={"white"} borderRadius={"full"} maxW={"fit-content"}>Active</Tag>
            </Stack>
            <Select width={"130px"}>
                <option value="">Actions</option>
            </Select>
        </HStack>
        <Stack mt={5} className="shadow-sm rounded-md border">
            <Box bg={'gray.100'} p={3}>
                <Text fontWeight={600}>Details</Text>
            </Box>
            <SimpleGrid columns={4} px={4} pb={6}>
                <Stack>
                    <Text fontSize={"15px"} color={"gray.500"}>Name</Text>
                    <Text fontSize={"15px"} fontWeight={500} color={"gray.700"}>John Ajayi</Text>
                </Stack>
                <Stack>
                    <Text fontSize={"15px"} color={"gray.500"}>Email</Text>
                    <Text fontSize={"15px"} fontWeight={500} color={"gray.700"}>john.ajayi@lendsqr.com</Text>
                </Stack>
                <Stack>
                    <Text fontSize={"15px"} color={"gray.500"}>Role</Text>
                    <Select maxW={"fit-content"}>
                        <option value="">Admin</option>
                    </Select>
                </Stack>
                <Stack>
                    <Text fontSize={"15px"} color={"gray.500"}>Status</Text>
                    <Tag bg={"green.600"} color={"white"} borderRadius={"full"} maxW={"fit-content"}>Active</Tag>
                </Stack>
            </SimpleGrid>
        </Stack>
        <Stack mt={5} className="shadow-sm rounded-md border">
            <Box bg={'#E8F1F8'} p={3}>
                <Text fontWeight={600} fontSize={"1rem"}>Recent Activities</Text>
            </Box>
            <Stack px={4} pb={6}>
                <InputGroup maxW={"280px"} mt={3}>
                    <InputLeftElement>
                        <Search className="w-5 h-auto text-gray-500"/>
                    </InputLeftElement>
                    <Input type='text' placeholder='search activities'outline={"none"} pl={10}/>
                </InputGroup>
                <Stack>
                {
                    activityData?.length === 0 
                    ? <EmptyOrder 
                    heading={`No Activity Yet`} 
                    content={`You currently have no activity. All activities will appear here.`} 
                    /> : 
                    <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                        <Table>
                            <Thead bg={"#E8F1F8"}>
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
                }
                </Stack>
            </Stack>
        </Stack>
    </div>
  )
}

export default MemberPage