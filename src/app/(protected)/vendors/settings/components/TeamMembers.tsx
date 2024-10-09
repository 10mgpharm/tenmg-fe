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
  useDisclosure,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EmptyOrder from "@/app/(protected)/suppliers/orders/components/EmptyOrder";
import { MemberData } from "@/data/mockdata";
import { ColumnsMemberFN } from "./table";
import Pagination from "@/app/(protected)/suppliers/components/Pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import InviteMember from "@/app/(protected)/admin/settings/components/InviteMember";
import requestClient from "@/lib/requestClient";

const Members = ({allMembersData}: {allMembersData: any}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onOpen: onOpenRole,
    onClose: onCloseRole,
    isOpen: isOpenRole,
  } = useDisclosure();
  const {
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
    isOpen: isOpenRemove,
  } = useDisclosure();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // const memoizedData = useMemo(() => data, [data]);

  console.log(allMembersData)

  const table = useReactTable({
    data: MemberData,
    columns: ColumnsMemberFN(onOpenRemove),
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
      <HStack justify={"flex-end"}>
        <Button onClick={onOpen} fontSize={"15px"} h={"38px"} px={3}>
          <Plus className="w-5 h-auto mr-1" />
          Add Team Member
        </Button>
      </HStack>
      <div className="mt-5">
        {MemberData?.length === 0 ? (
          <EmptyOrder />
        ) : (
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
            <Table>
              <Thead bg={"blue.50"}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers?.map((header) => (
                      <Th textTransform={"initial"} px="12px" key={header.id}>
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
                      <Td key={cell.id} px="12px">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
                <Tr>
                  <Td py={4} w={"full"} colSpan={5}>
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Button variant={"outline"} color={"gray.500"} leftIcon={<FaArrowLeft />}>
                    Previous
                  </Button>
                  <Pagination />
                  <Button variant={"outline"} color={"gray.500"} rightIcon={<FaArrowRight />}>
                    Next
                  </Button>
                  </Flex>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </div>
      <InviteMember onClose={onClose} isOpen={isOpen} accountType="vendor" />
     
    </div>
  );
};

export default Members;
