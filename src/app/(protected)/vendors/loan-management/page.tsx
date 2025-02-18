"use client";
import totalPattern from '@public/assets/images/bgPattern.svg';
import orderPattern from '@public/assets/images/orderPattern.svg';
import productPattern from '@public/assets/images/productpatterns.svg';
import OverviewCard from "../../suppliers/_components/OverviewCard/OverviewCard"
import SearchInput from '../_components/SearchInput';
import { CiFilter } from 'react-icons/ci';
import { useState } from 'react';
import { LoanByUser } from '@/data/mockdata';
import { ColumnsLoanFN } from './_components/table';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { Flex, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import EmptyResult from '../_components/EmptyResult';

const LoanManagement = () => {

  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data: LoanByUser ?? [],
    columns: ColumnsLoanFN(),
    state: {
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Loan Management</h3>
      <div className="grid grid-cols-4 gap-4 mt-5">
        <OverviewCard 
        title="Total Loans"
        value="5,600"
        fromColor="from-[#53389E]"
        toColor="to-[#7F56D9]"
        image={totalPattern}
        />
        <OverviewCard 
        title="Total Interests"
        value="₦2,300"
        fromColor="from-[#DC6803]"
        toColor="to-[#DC6803]"
        image={orderPattern}
        />
        <OverviewCard 
        title="Total Amount Disbursed"
        value="₦50,000"
        fromColor="from-[#3E4784]"
        toColor="to-[#3E4784]"
        image={productPattern}
        />
        <OverviewCard 
        title="Total Products"
        value="50,000"
        fromColor="from-[#E31B54]"
        toColor="to-[#E31B54]"
        image={productPattern}
        />
      </div>
      <div className="flex items-center gap-3 mt-5">
        <SearchInput
        placeholder="Search for a loan"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div
        // onClick={onOpenFilter}
        className="border cursor-pointer border-gray-300 p-2 rounded-md flex items-center gap-2"
        >
        <CiFilter className="w-5 h-5" />
        <p className="text-gray-500 font-medium">Filter</p>
        </div>
      </div>
      <div className="mt-5">
        {!loading ? (
        LoanByUser?.length !== 0 ? (
            <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
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
                    {/* <Td py={4} w="full" colSpan={7}>
                    <Pagination
                        meta={tablePagination}
                        setPageCount={setPageCount}
                    />
                    </Td> */}
                </Tr>
                </Tbody>
            </Table>
            </TableContainer>
        ) : (
            <EmptyResult heading={`Nothing to show here`} content={``} />
        )
        ) : (
        <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
        </Flex>
        )}
      </div>
    </div>
  )
}

export default LoanManagement