"use client";
import { 
    Button, 
    Flex, 
    HStack, 
    Input, 
    InputGroup, 
    InputLeftElement, 
    Stack, 
    Text,
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Th, 
    Thead, 
    Tr,
    useDisclosure
} from "@chakra-ui/react"
import { Plus, Search } from "lucide-react"
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
import EmptyOrder from '@/app/(protected)/suppliers/orders/components/EmptyOrder';
import { MemberData } from "@/data/mockdata";
import { ColumsMemberFN } from "../tables/memberTable";
import InviteMember from "./InviteMember";
import CreateRole from "./CreateRole";
import ConfirmModal from "./ConfirmModal";

const Members = () => {

    const { onOpen, onClose, isOpen } = useDisclosure();
    const { 
        onOpen: onOpenRole, 
        onClose: onCloseRole, 
        isOpen: isOpenRole 
    } = useDisclosure();
    const { 
        onOpen: onOpenRemove, 
        onClose: onCloseRemove, 
        isOpen: isOpenRemove 
    } = useDisclosure();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // const memoizedData = useMemo(() => data, [data]);

    const table = useReactTable({
        data: MemberData,
        columns: ColumsMemberFN(onOpenRemove),
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
        <HStack justify={"space-between"}>
            <Stack>
                <Text>Members</Text>
                <InputGroup>
                    <InputLeftElement>
                        <Search className="w-5 h-auto text-gray-500"/>
                    </InputLeftElement>
                    <Input type='text' placeholder='search members'outline={"none"} pl={10}/>
                </InputGroup>
            </Stack>
            <Flex gap={3}>
                <Button onClick={onOpenRole} fontSize={"15px"} h={"38px"} px={3} variant={"outline"}>
                    <Plus className="w-5 h-auto mr-1"/>
                    Create Role
                </Button>
                <Button onClick={onOpen} fontSize={"15px"} h={"38px"} px={3} bg={"blue.700"}>Invite Members</Button>
            </Flex>
        </HStack>
        <div className="mt-5">
        {
            MemberData?.length === 0 
            ? <EmptyOrder /> : 
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
        </div>
        <InviteMember onClose={onClose} isOpen={isOpen}/>
        <CreateRole isOpen={isOpenRole} onClose={onCloseRole} />
        <ConfirmModal isOpen={isOpenRemove} onClose={onCloseRemove}/>
    </div>
  )
}

export default Members