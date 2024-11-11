"use client";
import Pagination from "@/app/(protected)/suppliers/components/Pagination";
import { Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation";
import { ColumnsFN } from "../../components/trnascationtable";

const data = [
    {reference: "JRT003", decription: "", amount: "₦15,161,060", date : "12/05/2024"}
]
const TransactionRecord = () => {

    const router = useRouter();

    const table = useReactTable({
        data: data,
        columns: ColumnsFN(),
        manualFiltering: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
    <div className="p-8">
        <Flex cursor={"pointer"} onClick={() => router.back()} align={"center"} gap={2}>
            <ArrowLeft className="w-5 h-auto text-gray-500"/>
            <Text fontSize={"14px"} color={"gray.600"}>Back</Text>
        </Flex>
        <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"} mt={5}>
            <Table>
              <Thead bg={"blue.50"}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers?.map((header) => (
                      <Th
                        textTransform={"initial"}
                        px="0px"
                        key={header.id}
                        color={"primary.500"}
                        fontWeight={"500"}
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
                <Tr>
                  <Td py={4} w="full" colSpan={6}>
                    {/* <Pagination meta={tableData} setPageCount={setPageCount} /> */}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
        </TableContainer>
    </div>
  )
}

export default TransactionRecord