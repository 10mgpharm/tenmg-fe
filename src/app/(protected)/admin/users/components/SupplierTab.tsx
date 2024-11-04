"use client";
import Pagination from '@/app/(protected)/suppliers/components/Pagination'
import EmptyOrder from '@/app/(protected)/suppliers/orders/components/EmptyOrder'
import { 
    Stack,
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
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { ColumsSupplierFN } from './table';
import { ColumsVendorFN } from './VendorTable';
import { ColumsPharmFN } from './PharmacyTable';
import { MemberDataProp } from '@/types';
import { FaSpinner } from 'react-icons/fa6';

const SupplierTab = (
    {data, type, isLoading, setPageCount}: 
    {data: MemberDataProp, type: string, isLoading: boolean, setPageCount: Dispatch<SetStateAction<number>>}
) => {

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

    const records = useMemo(() => data?.data, [data?.data, type]);

    const renderedColumn =  type === "vendor" 
                            ?  ColumsVendorFN(onOpen, onOpenDeactivate)
                            : type === "pharmacies"
                            ? ColumsPharmFN(onOpen, onOpenDeactivate) 
                            : ColumsSupplierFN(onOpen, onOpenDeactivate)

    const table = useReactTable({
        data: records,
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
            isLoading ? 
            <Stack mt={"10rem"}>
                <FaSpinner className='animate-spin w-6 h-6 mx-auto'/>
            </Stack> :
            records?.length === 0 
            ? <EmptyOrder 
            heading={`No User Yet`} 
            content={`You currently have no user. All users will appear here.`}
            /> : 
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
                <Table>
                    <Thead bg={"#F2F4F7"}>
                    {table?.getHeaderGroups()?.map((headerGroup, index) => (
                        <Tr key={index}>
                        {headerGroup.headers?.map((header, index) => (
                            <Th
                            textTransform={"initial"}
                            px="6px"
                            key={index}
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
                    {records && table?.getRowModel()?.rows?.map((row, index) => (
                        <Tr key={index}>
                        {row.getVisibleCells()?.map((cell, index) => (
                            <Td key={index} px="6px">
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
                <Pagination meta={data?.meta} setPageCount={setPageCount}/>
            </TableContainer>
        }
    </div>
  )
}

export default SupplierTab;