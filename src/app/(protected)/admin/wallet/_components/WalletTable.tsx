"use client";

import EmptyOrder from '@/app/(protected)/suppliers/orders/_components/EmptyOrder'
import { 
    Checkbox, 
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Th, 
    Thead, 
    Tr, 
    useDisclosure 
} from '@chakra-ui/react'
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable
 } from '@tanstack/react-table';
import { useState } from 'react';
import { ColumsFN } from './table';
import TransactionDetails from './TransactionDetail';
import InitiatePayout from './InitiatePayout';
import { ColumsCompletedFN } from './CompletedTable';
import { ColumsHistoryFN } from './HistoryTable';

const WalletTable = ({data, type}: {data: any, type: string}) => {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { 
        isOpen: isOpenPayout, 
        onOpen: onOpenPayout, 
        onClose: onClosePayout 
    } = useDisclosure();
    
    const selectColumn = type === "completed"
                        ? ColumsCompletedFN(onOpen, onOpenPayout)
                        : type === "history"
                        ? ColumsHistoryFN(onOpen, onOpenPayout)
                        : ColumsFN(onOpen, onOpenPayout);
    const table = useReactTable({
        data: data,
        columns: selectColumn,
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
        {
            data?.length === 0 
            ? <EmptyOrder 
            heading={`No Wallet Yet`} 
            content={`You currently have no wallet. All wallets will appear here.`} 
            /> : 
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                <Table>
                    <Thead bg={"#F2F4F7"}>
                    {table?.getHeaderGroups()?.map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {
                                type === "awaiting" &&
                                <Th width={"40px"} textTransform={"initial"} px="0px">
                                    <Checkbox
                                    _checked={{
                                        "& .chakra-checkbox__control": {
                                        background: "#1A70B8",
                                        borderRadius: 5,
                                        },
                                    }}
                                    marginLeft={5}
                                    isChecked={table.getIsAllRowsSelected()}
                                    onChange={table.getToggleAllRowsSelectedHandler()}
                                    />
                                </Th>
                            }
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
                        {
                            type === "awaiting" && 
                            <Td px="0px" maxW={"40px"}>
                                <Checkbox
                                _checked={{
                                    "& .chakra-checkbox__control": {
                                    background: "#1A70B8",
                                    borderRadius: 5,
                                    },
                                }}
                                marginLeft={5}
                                isChecked={row.getIsSelected()}
                                onChange={row.getToggleSelectedHandler()}
                                />
                            </Td>
                        }
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
            </TableContainer>
        }
        <TransactionDetails isOpen={isOpen} onClose={onClose} type=''/>
        <InitiatePayout isOpen={isOpenPayout} onClose={onClosePayout}/>
    </div>
  )
}

export default WalletTable