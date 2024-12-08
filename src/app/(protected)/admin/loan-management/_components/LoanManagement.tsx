"use client";
import { useState } from "react";
import { 
    Button, 
    Flex,  
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Th,
    Thead, 
    Tr 
} from "@chakra-ui/react";
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import OverviewCard from "../../wallet/_components/OverviewCard";
import totalPattern from '@public/assets/images/bgPattern.svg';
import orderPattern from '@public/assets/images/orderPattern.svg';
import productPattern from '@public/assets/images/productpatterns.svg';
import SearchComponent from "@/app/(protected)/suppliers/orders/_components/SearchComponent";
import { ColumsLoanFN } from "./table";
import { LoanData } from "@/data/mockdata";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";

const LoanManagement = () => {

    const onOpen = () => {}

    const [pageCount, setPageCount] = useState<number>(1);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // const memoizedData = useMemo(() => data, [data]);

    const table = useReactTable({
        data: LoanData,
        columns: ColumsLoanFN(onOpen),
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

    const meta = {
        meta: {
            links: [
                {label: 'Previous', active: false},
                {label: 1, active: true}
            ]
        }
    }

  return (
    <div className="">
        <div className="grid grid-cols-4 gap-4 mt-5">
            <OverviewCard 
            title="Total Loans"
            value="20,942"
            fromColor="from-[#53389E]"
            toColor="to-[#7F56D9]"
            image={totalPattern}
            />
            <OverviewCard 
            title="Active Loans"
            value="1,031"
            fromColor="from-[#DC6803]"
            toColor="to-[#DC6803]"
            image={orderPattern}
            />
            <OverviewCard 
            title="Total Amount Loaned"
            value="₦123,849,900"
            fromColor="from-[#3E4784]"
            toColor="to-[#3E4784]"
            image={productPattern}
            />
            <OverviewCard 
            title="Pending Repayment"
            value="₦3,849,900"
            fromColor="from-[#E31B54]"
            toColor="to-[#E31B54]"
            image={productPattern}
            />
        </div>
        <Flex mt={4} gap={2}>
            <SearchComponent placeholder='Search for a user'/>
            <Button 
            h={""} 
            px={4} 
            variant={"outline"} 
            className="border text-gray-600 bg-white">
                Filter
            </Button>
        </Flex>
        <div className="mt-5">
        {
            LoanData?.length === 0 
            ? <EmptyOrder heading={`No Loan Yet`} content={`You currently have no loan application. All loan application will appear here.`}/> : 
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
                <Pagination 
                meta={meta}
                setPageCount={setPageCount}
                />
            </TableContainer>
        }
        </div>
    </div>
  )
}

export default LoanManagement