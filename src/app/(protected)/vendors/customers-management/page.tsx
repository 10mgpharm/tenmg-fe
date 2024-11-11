"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ColumnsCustomerFN } from "./components/table";
import Link from "next/link";
import FilterDrawer from "./components/FilterDrawer";
import Pagination from "../../suppliers/components/Pagination";
import UploadModel from "./components/UploadModel";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { CustomerDataProp, NextAuthUserSession } from "@/types";
import { saveAs } from "file-saver";
import { createXlsxTemplate } from "@/utils/createXlsxTemplate";
import SearchInput from "../components/SearchInput";
import EmptyResult from "../components/EmptyResult";
import { useDebouncedValue } from "@/utils/debounce";

interface IFormInput {
  endDate?: Date | null;
  startDate?: Date | null;
  status?: string;
}

const CustomerManagement = () => {
  const [loading, setLoading] = useState(true);
  const [allCustomersData, setAllCustomersData] =
    useState<CustomerDataProp | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    let query = `/vendor/customers?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }
    if (status) {
      query += `&status=${status}`;
    }
    if (createdAtStart) {
      query += `&createdAtStart=${createdAtStart.toISOString().split("T")[0]}`;
    }
    if (createdAtEnd) {
      query += `&createdAtEnd=${createdAtEnd.toISOString().split("T")[0]}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setAllCustomersData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, pageCount, debouncedSearch, status, createdAtStart, createdAtEnd]);

  // const handleDownloadCustomer = useCallback(async () => {
  //   try {
  //     const response = await requestClient({
  //       token: token,
  //       responseType: "blob",
  //     }).get(`/vendor/customers/export`);
  //     if (response.status === 200) {
  //       const contentType = response.headers["content-type"];
  //       const contentDisposition = response.headers["content-disposition"];
  //       let fileName = "customers.xlsx";

  //       if (contentDisposition) {
  //         const fileNameMatch =
  //           contentDisposition.match(/filename="?([^"]+)"?/);
  //         if (fileNameMatch && fileNameMatch[1]) {
  //           fileName = fileNameMatch[1];
  //         }
  //       }

  //       // Create a blob from the response data
  //       const blob = new Blob([response.data], { type: contentType });

  //       // Create a URL for the blob
  //       const url = window.URL.createObjectURL(blob);

  //       // Create a temporary anchor element to trigger the download
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = fileName; // Use the extracted file name

  //       // Append the anchor to the body and trigger the click event
  //       document.body.appendChild(a);
  //       a.click();

  //       // Clean up
  //       a.remove();
  //       window.URL.revokeObjectURL(url);
  //     } else {
  //       console.error("Error downloading the file:", response.statusText);
  //       alert("Failed to download the file. Please try again later.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // }, [token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleToggle = useCallback(
    async (id: number) => {
      try {
        const response = await requestClient({
          token: token,
        }).patch(`/vendor/customers/${id}`);
        if (response.status === 200) {
          toast.success(`Customer status has been updated.`);
          fetchCustomers(); // Refetch data to reflect the changes
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update the customer status.");
      }
    },
    [token, fetchCustomers]
  );

  const handleDownloadTemplate = useCallback(() => {
    const headerMappings = [
      { key: "vendor_code", header: "vendor_code" },
      { key: "name", header: "name" },
      { key: "email", header: "email" },
      { key: "phone", header: "phone" },
      { key: "active", header: "active" },
    ];

    const templateBlob = createXlsxTemplate(
      headerMappings,
      "Vendor Customer Template"
    );

    saveAs(templateBlob, "vendor_customer_uploads.xlsx");
  }, []);

  const applyFilters = (filters: IFormInput) => {
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

  const tableData: CustomerDataProp = useMemo(
    () => allCustomersData,
    [allCustomersData]
  );

  const columns = useMemo(
    () => ColumnsCustomerFN(handleToggle),
    [handleToggle]
  );

  const table = useReactTable({
    data: tableData ? tableData?.data : [],
    columns: columns,
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
      <h3 className="font-semibold text-2xl">Customers Management</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <SearchInput
              placeholder="Search for a Customer"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
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
        ) : tableData && tableData?.data?.length === 0 ? (
          <EmptyResult
            heading={`Nothing to show here yet`}
            content={`You don’t have any customer yet. When you do, they’ll appear here.`}
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
                    <Pagination meta={tableData} setPageCount={setPageCount} />
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
        handleDownload={handleDownloadTemplate}
        reloadCustomers={fetchCustomers}
      />
      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />
    </div>
  );
};

export default CustomerManagement;
