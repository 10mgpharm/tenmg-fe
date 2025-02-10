import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable 
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ColumsDiscountFN } from "./table";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import { Flex, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import { DiscountResponseData } from "@/types";

interface DiscountTableProp {
    data: DiscountResponseData;
    type: string;
    pageCount: number;
    loading: boolean
    setPageCount: Dispatch<SetStateAction<number>>;
}
const DiscountTable = ({data, pageCount, setPageCount, type, loading}: DiscountTableProp) => {

    const onOpen = () => {}
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const memoizedData = useMemo(() => data?.data, [data?.data]);

    const table = useReactTable({
        data: memoizedData,
        columns: ColumsDiscountFN(onOpen, pageCount, 15),
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
        loading ? 
        <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
        </Flex>: 
        data?.data?.length === 0 
        ? <EmptyOrder 
        heading={`No ${type} Discount Yet`} 
        content={`You currently have no ${type} discount. All discounts will appear here.`} 
        /> : 
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
                {data?.data && table?.getRowModel()?.rows?.map((row) => (
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
            <Pagination
                meta={data?.meta}
                setPageCount={setPageCount}
            />
        </TableContainer>
    }
    </div>
  )
}

export default DiscountTable