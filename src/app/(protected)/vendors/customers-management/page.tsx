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
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import { toast } from "react-toastify";
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
  const [isUploadLoading, setIsUploadLoading] = useState<Boolean>(false);
  const [allCustomersData, setAllCustomersData] = useState<CustomerData | null>(
    null
  );
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [total, setTotal] = useState<any>("");

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

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token: token }).get(
        `/vendor/customers?page=${pageCount}`
      );
      if (response.status === 200) {
        setAllCustomersData(response.data.data);
        setTotal(response.data.data.total);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token]);

  const handleDownloadCustomer = useCallback(async () => {
    try {
      const response = await requestClient({
        token: token,
        responseType: "blob",
      }).get(`/vendor/customers/export`);
      if (response.status === 200) {
        const contentType = response.headers["content-type"];
        const contentDisposition = response.headers["content-disposition"];
        let fileName = "customers.xlsx";

        if (contentDisposition) {
          const fileNameMatch =
            contentDisposition.match(/filename="?([^"]+)"?/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1];
          }
        }

        // Create a blob from the response data
        const blob = new Blob([response.data], { type: contentType });

        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Use the extracted file name

        // Append the anchor to the body and trigger the click event
        document.body.appendChild(a);
        a.click();

        // Clean up
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Error downloading the file:", response.statusText);
        alert("Failed to download the file. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerms(e.target.value);
  //   // setFilteredData()
  // };

  const tableData: CustomerData = useMemo(
    () => allCustomersData,
    [allCustomersData]
  );

  const table = useReactTable({
    data: tableData?.data,
    columns: ColumnsCustomerFN(),
    state: {
      globalFilter,
      // pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    // onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // manualPagination: true,
    // pageCount: tableData ? tableData?.lastPage : -1,
    // rowCount: tableData?.perPage,
  });

  return (
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Customers Management</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <SearchInput
              placeholder="Search for a Customer"
              onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            />
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
                    {/* <Pagination table={table} /> */}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </div>
      <UploadModel
        isOpen={isOpen}
        onClose={onClose}
        handleDownload={handleDownloadCustomer}
      />
      {/* <RestockModal isOpen={isOpenRestock} onClose={onCloseRestock} /> */}
      <DeactiveModal isOpen={isOpenDeactivate} onClose={onCloseDeactivate} />
      <FilterDrawer isOpen={isOpenFilter} onClose={onCloseFilter} />
    </div>
  );
};

export default CustomersManagment;
