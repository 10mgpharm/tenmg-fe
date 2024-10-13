"use client";
import Pagination from '@/app/(protected)/suppliers/components/Pagination'
import EmptyOrder from '@/app/(protected)/suppliers/orders/components/EmptyOrder'
import { 
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
} from '@tanstack/react-table'
import React, { useState } from 'react'
import { ColumsSupplierFN } from './table';
import { ColumsVendorFN } from './VendorTable';
import { ColumsPharmFN } from './PharmacyTable';

const SupplierTab = ({data, type}: {data: any, type: string}) => {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { 
        isOpen: isOpenDeactivate, 
        onOpen: onOpenDeactivate, 
        onClose: onCloseDeactivate 
    } = useDisclosure();
    const renderedColumn =  type === "vendor" 
                            ?  ColumsVendorFN(onOpen, onOpenDeactivate)
                            : type === "pharmacies"
                            ? ColumsPharmFN(onOpen, onOpenDeactivate) 
                            : ColumsSupplierFN(onOpen, onOpenDeactivate)

    const table = useReactTable({
        data: data,
        columns: renderedColumn,
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

export default SupplierTab;