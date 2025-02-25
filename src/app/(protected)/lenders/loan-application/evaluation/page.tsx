// 'use client'
// import { Button } from '@chakra-ui/react'
// import { useRouter } from 'next/navigation'
// import React from 'react'
// import { PiCaretLeftBold } from 'react-icons/pi'

// export default function LoanEvaluationPage() {

//   const router = useRouter();
//   const options = {
//     // series: [44, 55, 13, 33],
//     // labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
//   }

//   return (
//     <div className='px-10 py-4 bg-white border-l border-slate-300'>
//       <div className='flex items-center justify-between w-full'>
//         <Button leftIcon={<PiCaretLeftBold />} colorScheme='primary' variant='unstyled' onClick={() => { router.push('/lenders/loan-application') }}>
//           Back
//         </Button>

//         <div className='flex items-center gap-3 my-4'>
//           <Button size='sm' colorScheme={'primary'} variant={'solid'}>
//             Download Transaction History
//           </Button>
//           <Button size="sm" colorScheme={'primary'} variant={'outline'}>
//             View Uploaded Transction History
//           </Button>
//         </div>
//       </div>

//       <div>
//         <h4 className="font-semibold">Application Details</h4>
//         <p className="text-sm">Overview of borrower’s loan details, including their evaluation reference and credit score.</p>
//       </div>

//       <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 my-10'>
//         {/*  */}
//         <div>
//           <div className='w-full rounded-t-xl rounded-b-md overflow-hidden border border-slate-300'>
//             <div className='bg-[#F1F2F4] px-5 py-3 '>
//               <h4 className="font-semibold">Customer Information</h4>
//             </div>

//             <div className="w-full p-3 bg-white">

//               <div className="space-y-1 my-2">
//                 <p className='text-sm font-light'>Name</p>
//                 <h4 className="font-semibold text-xs">Sunday Ajayi</h4>
//               </div>

//               <div className="space-y-1 my-2">
//                 <p className='text-sm font-light'>Email Address</p>
//                 <h4 className="font-semibold text-xs">sundayajayi@lendsqr.com</h4>
//               </div>

//               <div className="space-y-1 my-2">
//                 <p className='text-sm font-light'>Evaluation ID</p>
//                 <h4 className="font-semibold text-xs">Eval-20241030-1624-29404</h4>
//               </div>

//               <div className="space-y-1 my-2">
//                 <p className='text-sm font-light'>Customer ID</p>
//                 <h4 className="font-semibold text-xs">10MG-C23404</h4>
//               </div>

//               <div className="space-y-1 my-2">
//                 <p className='text-sm font-light'>Vendor</p>
//                 <h4 className="font-semibold text-xs">Bubbles Pharmacy LTD</h4>
//               </div>

//             </div>
//           </div>
//         </div>

//         {/*  */}
//         <div className='flex flex-col gap-4 h-full justify-between'>

//           <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//             <p className='text-sm font-light'>Average Transaction Volume</p>
//             <p className='text-sm font-semibold'>₦161,060</p>
//           </div>

//           <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//             <p className='text-sm font-light'>Average Transaction Volume</p>
//             <p className='text-sm font-semibold'>₦161,060</p>
//           </div>

//           <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//             <p className='text-sm font-light'>Average Transaction Volume</p>
//             <p className='text-sm font-semibold'>₦161,060</p>
//           </div>

//         </div>

//         <div className='flex flex-col gap-4 justify-between h-full'>
//           <div className='grid grid-cols-3'>

//             <div className='col-span-1 flex flex-col justify-between'>
//               <h5 className='font-semibold text-sm'>Credit Score</h5>

//               <div className='space-y-2'>
//                 <p className='text-sm font-light'>Score Category</p>
//                 <p className='text-sm font-semibold'>Category A</p>
//               </div>
//               <div className='space-y-2'>
//                 <p className='text-sm font-light'>Score Value</p>
//                 <p className='text-sm font-semibold'>855/950  </p>
//               </div>
//             </div>

//             <div className='col-span-2'>


//             </div>
//           </div>
//           <div>
//             <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//               <p className='text-sm font-semibold'>Affordability Amount</p>
//               <div className='flex justify-between items-center'>
//                 <div>
//                   <p className='text-sm font-light'>Min Amount</p>
//                   <p className='text-sm font-semibold'>₦161,060</p>
//                 </div>
//                 <div>
//                   <p className='text-sm font-light'>Max Amount</p>
//                   <p className='text-sm font-semibold'>₦161,060</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>

//       <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 my-10'>
//         <div className='col-span-1'>
//           <div className='border border-slate-300 rounded-md p-5 space-y-2'>
//             <p className='text-sm font-semibold'>Result Breakdown</p>
//             <p className='text-sm font-light'>This outlines the breakdown of how the user score was computed</p>
//             <Button variant="outline" colorScheme="primary" size={"sm"} className='w-full'>View Breakdown</Button>
//           </div>
//         </div>
//         <div className='col-span-2'>
//           <h4>Transaction Sumamry</h4>

//           <div className='grid grid-cols-3'>
//             <div className='col-span-1'>
//               <div className='my-2'>
//                 <p className='text-sm'>First Day in Transaction:</p>
//                 <p className='text-sm'>  Feb 11, 2024  </p>
//               </div>
//               <div className='my-2'>
//                 <p className='text-sm'>Last Day in Transaction:</p>
//                 <p className='text-sm'>Feb 11, 2024  </p>
//               </div>

//               <Button className='my-2 text-[8px]' variant="outline" size="xs" py="2px" colorScheme="primary">Transaction is equal or above 6 months</Button>

//             </div>
//           </div>

//           <div className='grid grid-cols-5 my-5 gap-4'>
//             <div className='col-span-3'>
//               <div className='grid grid-cols-2 gap-3'>

//                 <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//                   <p className='text-sm font-light'>Total Past Credit Amount</p>
//                   <p className='text-sm font-semibold'>₦161,060</p>
//                 </div>
//                 <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//                   <p className='text-sm font-light'>Total Past Credit Count</p>
//                   <p className='text-sm font-semibold'>5</p>
//                 </div>
//                 <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//                   <p className='text-sm font-light'>Active Credit Amount</p>
//                   <p className='text-sm font-semibold'>₦161,060</p>
//                 </div>
//                 <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//                   <p className='text-sm font-light'>Active Credit Count</p>
//                   <p className='text-sm font-semibold'>6</p>
//                 </div>
//                 <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//                   <p className='text-sm font-light'>No. of Late  Repayments</p>
//                   <p className='text-sm font-semibold'>6 months</p>
//                 </div>
//                 <div className='border border-slate-300 rounded-md p-5 space-y-3'>
//                   <p className='text-xs '>No. of Late Repayments</p>
//                   <p className='text-sm font-semibold'>₦161,060</p>
//                 </div>

//               </div>
//             </div>
//             <div className='col-span-2'>
//               <div className='flex items-center justify-center border border-slate-300 rounded-md'>
//                 <p>Performing</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
// import SearchInput from "../_components/SearchInput";
import { CiFilter } from "react-icons/ci";
import {
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import requestClient from "@/lib/requestClient";
import {
  CustomerData,
  NextAuthUserSession,
  TransactionHistoryDataProps,
} from "@/types";
import { useSession } from "next-auth/react";
// import EmptyResult from "../_components/EmptyResult";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import Pagination from "../../suppliers/_components/Pagination";
// import { ColumnsTnxHistoryFN } from "./_components/table";
// import UploadModal from "../_components/UploadModal";
import { useDebouncedValue } from "@/utils/debounce";
// import { IFilterInput } from "../customers-management/page";
// import FilterDrawer from "../_components/FilterDrawer";
import { dateToString } from "@/utils/formatDate";
import { IFilterInput } from "@/app/(protected)/vendors/credit-score/page";
import { ColumnsTnxHistoryFN } from "@/app/(protected)/vendors/transactions-history/_components/table";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import Pagination from "../../_components/Pagination";
import EmptyResult from "@/app/(protected)/vendors/_components/EmptyResult";
import UploadModal from "@/app/(protected)/vendors/_components/UploadModal";
import FilterDrawer from "@/app/(protected)/vendors/_components/FilterDrawer";

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [status, setStatus] = useState<string>("");
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [tnxHistoryData, setTnxHistoryData] =
    useState<TransactionHistoryDataProps | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState<
    CustomerData[] | null
  >(null);

  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const applyFilters = (filters: IFilterInput) => {
    setCreatedAtStart(filters.startDate);
    setCreatedAtEnd(filters.endDate);
    setStatus(filters.status);
  };

  const clearFilters = () => {
    setCreatedAtStart(null);
    setCreatedAtEnd(null);
    setStatus("");
    setGlobalFilter("");
  };

  const filterOptions = [
    { option: "Done", value: "done" },
    { option: "Pending", value: "pending" },
  ];

  const fetchCustomerTnx = useCallback(
    async (page = 1) => {
      setLoading(true);

      let query = `/vendor/txn_history/get-all-txn?page=${page}`;

      if (debouncedSearch) {
        query += `&search=${debouncedSearch}`;
      }
      if (status) {
        query += `&status=${status}`;
      }
      if (createdAtStart) {
        query += `&dateFrom=${dateToString(createdAtStart)}`;
      }
      if (createdAtEnd) {
        query += `&dateTo=${dateToString(createdAtEnd)}`;
      }

      try {
        const response = await requestClient({ token }).get(query);
        if (response.status === 200) {
          setTnxHistoryData(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [token, debouncedSearch, status, createdAtStart, createdAtEnd]
  );

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await requestClient({ token }).get(
        "vendor/customers/get-all"
      );
      if (response.status === 200) {
        setSelectedCustomerId(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchCustomerTnx(pageCount);
    fetchCustomers();
  }, [fetchCustomerTnx, pageCount, token, fetchCustomers]);

  const tableData = useMemo(() => tnxHistoryData?.data || [], [tnxHistoryData]);
  const columns = useMemo(() => ColumnsTnxHistoryFN(), []);

  const table = useReactTable({
    data: tableData ? tableData : [],
    columns,
    state: {
      globalFilter,
    },
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tablePagination = useMemo(
    () => tnxHistoryData?.meta || [],
    [tnxHistoryData]
  );

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Transaction Evaluations</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <SearchInput
              placeholder="Search for a transaction"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <div
              onClick={onOpenFilter}
              className="border cursor-pointer border-gray-300 p-2 rounded-md flex items-center gap-2"
            >
              <CiFilter className="w-5 h-5" />
              <p className="text-gray-500 font-medium">Filter</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={onOpen}>Evaluate Transaction History</Button>
        </div>
      </div>
      <div>
        {loading && (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )}

        {!loading && tableData.length > 0 && (
          <TableContainer border="1px solid #F9FAFB" borderRadius="10px">
            <Table>
              <Thead bg="blue.50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        textTransform="initial"
                        px="0px"
                        key={header.id}
                        color="primary.500"
                        fontWeight="500"
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
              <Tbody bg="white" color="#606060" fontSize="14px">
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
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
                  <Td py={4} w="full" colSpan={columns.length}>
                    <Pagination
                    // meta={tablePagination}
                    // setPageCount={setPageCount}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {!loading && tableData.length === 0 && (
          <EmptyResult heading="No record available" content="" />
        )}
      </div>

      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        isDownloadTemplate={false}
        uploadEndpoint="/vendor/txn_history/upload_and_evaluate"
        isSearch
        searchTitle="Customer by Name or Email"
        searchData={selectedCustomerId}
        reloadData={fetchCustomerTnx}
      />
      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default TransactionHistory;
