"use client";
import SearchComponent from "@/app/(protected)/suppliers/orders/components/SearchComponent"
import { 
    Button,
    Flex, 
    HStack,
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Text, 
    Th,
    Thead, 
    Tr, 
    useDisclosure
} from "@chakra-ui/react"
import { 
    ColumnOrderState, 
    RowSelectionState, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    getSortedRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import { useCallback, useEffect, useState } from "react";
import { ColumsApplicationFN } from "./applicationTable";
import EmptyOrder from "@/app/(protected)/suppliers/orders/components/EmptyOrder";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import { applicationData } from "@/data/mockdata";
import CreateLoan from "./CreateLoan";
import SuccessModal from "./SuccessModal";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import {  NextAuthUserSession } from "@/types";

const LoanApplication = () => {

    const session = useSession();
    const sessionData = session?.data as NextAuthUserSession;
    const token = sessionData?.user?.token;
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {
        isOpen: isOpenSuccess, 
        onOpen: onOpenSuccess, 
        onClose: onCloseSuccess
    } = useDisclosure();
    const {
        isOpen: isOpenSend, 
        onOpen: onOpenSend, 
        onClose: onCloseSend
    } = useDisclosure();
    const [loading, setLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // const memoizedData = useMemo(() => data, [data])

    const table = useReactTable({
        data: applicationData,
        columns: ColumsApplicationFN(onOpen),
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
            <Flex mt={4} gap={2}>
                <SearchComponent placeholder='Search for a user'/>
                <Button 
                h={"40px"} 
                px={4} 
                variant={"outline"} 
                className="border text-gray-600 bg-white">
                    Filter
                </Button>
            </Flex>
            <Flex gap={2}>
                <Button 
                 h={"40px"}
                px={4} 
                variant={"outline"} 
                className="border bg-white">
                    Send Application Link
                </Button>
                <Button 
                h={"40px"}
                px={4} 
                onClick={onOpen}
                className="border bg-white">
                    Create Application
                </Button>
            </Flex>
        </HStack>
        <div className="mt-5">
        {
            applicationData?.length === 0 
            ? <EmptyOrder 
            heading={`No Loan Yet`} 
            content={`You currently have no loan application. All loan application will appear here.`} 
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
                {/* <Pagination /> */}
            </TableContainer>
        }
        </div>
        <CreateLoan 
        isOpen={isOpen} 
        onClose={onClose} 
        onOpenSuccess={onOpenSuccess} />
        <SuccessModal 
        isOpen={isOpenSuccess} 
        onClose={onCloseSuccess}
        />
    </div>
  )
}

export default LoanApplication