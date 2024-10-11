"use client";

import Pagination from '@/app/(protected)/suppliers/components/Pagination'
import EmptyOrder from '@/app/(protected)/suppliers/orders/components/EmptyOrder'
import { Flex, HStack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import { ColumnOrderState, RowSelectionState, SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { ColumsUserFN } from './table';

const UserTable = ({data, type}: {data: any, type: string}) => {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenDeactivate, 
        onOpen: onOpenDeactivate, 
        onClose: onCloseDeactivate 
    } = useDisclosure();

    const table = useReactTable({
        data: data,
        columns: ColumsUserFN(onOpen, onOpenDeactivate),
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
    <div className="">
        {
            data?.length === 0 
            ? <EmptyOrder 
            heading={`No User Yet`} 
            content={`You currently have no user. All users will appear here.`}
            /> : 
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                <Table>
                    <Thead bg={"#F2F4F7"}>
                    {table?.getHeaderGroups()?.map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                        {/* <Th textTransform={"initial"} px="0px">
                            <Checkbox
                            _checked={{
                                "& .chakra-checkbox__control": {
                                background: "#1A70B8",
                                // borderColor: "#D0D5DD",
                                borderRadius: 5,
                                },
                            }}
                            marginLeft={5}
                            isChecked={table.getIsAllRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                            />
                        </Th> */}
                        {headerGroup.headers?.map((header) => (
                            <Th
                            textTransform={"initial"}
                            px="6px"
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
                        {/* <Td px="0px">
                            <Checkbox
                            _checked={{
                                "& .chakra-checkbox__control": {
                                background: "#1A70B8",
                                // borderColor: "#D0D5DD",
                                borderRadius: 5,
                                },
                            }}
                            marginLeft={5}
                            isChecked={row.getIsSelected()}
                            onChange={row.getToggleSelectedHandler()}
                            />
                        </Td> */}
                        {row.getVisibleCells()?.map((cell) => (
                            <Td key={cell.id} px="6px">
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
                <Pagination />
            </TableContainer>
        }
    </div>
  )
}

export default UserTable