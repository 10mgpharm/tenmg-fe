"use client";

import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from "@tanstack/react-table";
import { useState } from "react";
import { ColumsTransactionFN } from "./table";
import EmptyOrder from "../../orders/components/EmptyOrder";
import { Table,TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const TransactionTable = ({data}: {data: any}) => {

    const onOpen = () => {}
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
        data: data,
        columns: ColumsTransactionFN(onOpen),
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
  )
}

export default TransactionTable