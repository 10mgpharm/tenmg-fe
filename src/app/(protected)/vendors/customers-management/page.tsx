"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { IoListOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
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
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ColumnsCustomerFN } from "./components/table";
import Link from "next/link";
import FilterDrawer from "../../suppliers/products/components/FilterDrawer";
import Pagination from "../../suppliers/components/Pagination";
// import { customersManagementData } from "@/data/mockdata";
import EmptyOrder from "../../suppliers/orders/components/EmptyOrder";
import DeleteModal from "../../suppliers/products/components/DeleteModal";
import DeactiveModal from "../../suppliers/products/components/DeactiveModal";
import UploadModel from "./components/UploadModel";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import SearchInput from "../components/SearchInput";

interface CustomerData {
  currentPage: number;
  data: any[];
  total: number;
  perPage: number;
  lastPage: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

const CustomersManagment = () => {
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [allCustomersData, setAllCustomersData] = useState<CustomerData | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState(allCustomersData || null);
  const [searchTerms, setSearchTerms] = useState<string>("");

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenRestock,
    onClose: onCloseRestock,
    onOpen: onOpenRestock,
  } = useDisclosure();
  const {
    isOpen: isOpenDeactivate,
    onClose: onCloseDeactivate,
    onOpen: onOpenDeactivate,
  } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  // const memoizedData = useMemo(() => data, [data]);

  const fetchCustomers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const response = await requestClient({ token: token }).get(
          `/vendor/customers?page=${page}`
        );
        if (response.status === 200) {
          setAllCustomersData(response.data.data);
          setCurrentPage(response.data.data.currentPage);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [fetchCustomers, currentPage]);

  const handleSearch = () => {

    // setFilteredData()
  }

  const handleNextPage = useCallback(() => {
    if (allCustomersData?.nextPageUrl) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [allCustomersData]);

  const handlePrevPage = useCallback(() => {
    if (allCustomersData?.prevPageUrl) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [allCustomersData]);

  const tableData = useMemo(
    () => allCustomersData?.data || [],
    [allCustomersData?.data]
  );

  const table = useReactTable({
    data: tableData,
    columns: ColumnsCustomerFN(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Customers Management</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
           <SearchInput placeholder="Search for a user" searchTerms={searchTerms} onChange={(e) => setSearchTerms(e.target.value)}/>
            <div
              onClick={onOpenFilter}
              className="border cursor-pointer border-gray-300 p-3 rounded-md flex items-center gap-2"
            >
              <CiFilter className="w-5 h-5" />
              <p className="text-gray-500 font-medium">Filter</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" color="primary.500" onClick={onOpen}>
            Upload Bulk Customers
          </Button>
          <Button as={Link} href={"/vendors/customers-management/new"}>
            Create Customer
          </Button>
        </div>
      </div>
      <div className="">
        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : allCustomersData?.data?.length === 0 ? (
          <EmptyOrder
            heading={`Nothing to show here yet`}
            content={`You don’t have any customer yet. When you do, they’ll apper here.`}
          />
        ) : (
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
                  <Td py={4} w="full" colSpan={6}>
                    <Pagination
                      handlePrevious={handlePrevPage}
                      handleNext={handleNextPage}
                      allTableData={allCustomersData}
                      onPageChange={(page) => fetchCustomers(page)}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </div>
      <UploadModel isOpen={isOpen} onClose={onClose} />
      {/* <RestockModal isOpen={isOpenRestock} onClose={onCloseRestock} /> */}
      <DeactiveModal isOpen={isOpenDeactivate} onClose={onCloseDeactivate} />
      <FilterDrawer isOpen={isOpenFilter} onClose={onCloseFilter} />
    </div>
  );
};

export default CustomersManagment;
