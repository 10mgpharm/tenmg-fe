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
import { motion, AnimatePresence } from "framer-motion";

import { ColumnsCustomerFN } from "./_components/table";
import Link from "next/link";
import FilterDrawer from "../_components/FilterDrawer";
import Pagination from "../../suppliers/_components/Pagination";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { CustomerDataProp, NextAuthUserSession } from "@/types";
import { saveAs } from "file-saver";
import { createXlsxTemplate } from "@/utils/createXlsxTemplate";
import SearchInput from "../_components/SearchInput";
import EmptyResult from "../_components/EmptyResult";
import { useDebouncedValue } from "@/utils/debounce";
import UploadModal from "../_components/UploadModal";
import { ConfirmationModal } from "./_components/ConfirmationModal";
import { dateToString } from "@/utils/formatDate";
import { formatDateRange } from "@/lib/dateFormatter";
import { IApplyFilters } from "../loan-applications/page";

export interface IFilterInput {
  endDate?: Date | null;
  startDate?: Date | null;
  toDate?: Date | null;
  fromDate?: Date | null;
  status?: string;
  inventory?: string;
  brand?: string;
}

// Framer Motion components
const MotionTr = motion(Tr);
const MotionDiv = motion.div;

// Animation variants
const tableContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const CustomerManagement = () => {
  const [loading, setLoading] = useState(true);
  const [allCustomersData, setAllCustomersData] =
    useState<CustomerDataProp | null>(null);

  const [pageCount, setPageCount] = useState<number>(1);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"activate" | "suspend" | null>(
    null
  );

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
      query += `&createdAtStart=${formatDateRange(createdAtStart, false)}`;
    }
    if (createdAtEnd) {
      query += `&createdAtEnd=${formatDateRange(createdAtStart, false)}`;
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
          fetchCustomers();
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update the customer status.");
      }
    },
    [token, fetchCustomers]
  );

  const handleOpenModal = (id: number, action: "activate" | "suspend") => {
    setSelectedUserId(id);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirmToggle = () => {
    if (selectedUserId !== null) {
      handleToggle(selectedUserId);
      setIsModalOpen(false);
      setSelectedUserId(null);
      setActionType(null);
    }
  };

  const handleDownloadTemplate = useCallback(() => {
    const headerMappings = [
      { key: "name", header: "NAME" },
      { key: "email", header: "EMAIL" },
      { key: "phone", header: "PHONE" },
      { key: "reference", header: "REFERENCE (OPTIONAL)" },
    ];

    const bodyMappings = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "9067636443",
        reference: "REF123",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "9076543210",
        reference: "REF456",
      },
    ];

    const templateBlob = createXlsxTemplate(
      headerMappings,
      "Vendor Customer Template",
      bodyMappings
    );

    saveAs(templateBlob, "vendor_customer_uploads.xlsx");
  }, []);

  const applyFilters = (filters: IApplyFilters) => {
    console.log(filters);
    setCreatedAtStart(filters.startDate || null);
    setCreatedAtEnd(filters.endDate || null);
    setStatus(filters.status || "");
  };

  const clearFilters = () => {
    setCreatedAtStart(null);
    setCreatedAtEnd(null);
    setStatus("");
    setGlobalFilter("");
  };

  const filterOptions = [
    { option: "Active", value: "active" },
    { option: "Suspended", value: "inactive" },
  ];

  const tableData: CustomerDataProp | null = useMemo(
    () => allCustomersData,
    [allCustomersData]
  );

  const columns = useMemo(() => ColumnsCustomerFN(handleOpenModal), []);

  const table = useReactTable({
    data: tableData ? tableData.data : [],
    columns: columns,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Customers Management
        </h3>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between flex-wrap gap-4"
      >
        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-3 flex-wrap">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <SearchInput
                placeholder="Search for a Customer"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "#f0f9ff" }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenFilter}
              className="border cursor-pointer border-gray-300 bg-white p-3 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <CiFilter className="w-5 h-5 text-blue-600" />
              <p className="text-gray-700 font-medium">Filter</p>
            </motion.div>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              color="primary.500"
              onClick={onOpen}
              className="shadow-sm hover:shadow-md transition-shadow w-full "
            >
              Upload Bulk Customers
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              as={Link}
              href={"/vendors/customers-management/new"}
              className="shadow-sm hover:shadow-md transition-shadow w-full"
            >
              Create Customer
            </Button>
          </motion.div>
        </div>
      </MotionDiv>

      {/* TABLE SECTION */}
      <MotionDiv
        className="mt-6"
        initial="hidden"
        animate="visible"
        variants={tableContainerVariants}
      >
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Flex justify="center" align="center" height="400px">
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
          </motion.div>
        ) : tableData && tableData.data.length !== 0 ? (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <TableContainer
              border="1px solid #E5E7EB"
              borderRadius="16px"
              overflowX="auto"
              w="100%"
              bg="white"
              boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              className="backdrop-blur-sm"
            >
              <Table variant="simple" size="sm">
                <Thead bg="gradient-to-r from-blue-50 to-purple-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <motion.th
                          key={header.id}
                          variants={headerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.05 }}
                          style={{
                            textTransform: "initial",
                            padding: "16px",
                            minWidth: "120px",
                            whiteSpace: "nowrap",
                            color: "#3B82F6",
                            fontWeight: "600",
                            fontSize: "14px",
                            letterSpacing: "0.025em",
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </motion.th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody bg="white" color="#374151" fontSize="14px">
                  <AnimatePresence mode="popLayout">
                    {table.getRowModel().rows.map((row, rowIndex) => (
                      <MotionTr
                        key={row.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        custom={rowIndex}
                        transition={{ delay: rowIndex * 0.03 }}
                        style={{
                          borderBottom: "1px solid #F3F4F6",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            px={{ base: "8px", md: "16px" }}
                            py="16px"
                            minW="120px"
                            whiteSpace="nowrap"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        ))}
                      </MotionTr>
                    ))}
                  </AnimatePresence>
                  <Tr>
                    <Td py={4} w="full" colSpan={6} borderBottom="none">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Pagination
                          meta={tableData}
                          setPageCount={setPageCount}
                        />
                      </motion.div>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </MotionDiv>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyResult
              heading="Nothing to show here"
              content="Record Not Found! No customer found for your search criteria."
            />
          </motion.div>
        )}
      </MotionDiv>

      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        handleDownload={handleDownloadTemplate}
        reloadData={fetchCustomers}
        isDownloadTemplate={true}
        isCustomer
        uploadEndpoint="/vendor/customers/import"
      />
      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
      />
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmToggle}
          actionType={actionType}
        />
      )}
    </div>
  );
};

export default CustomerManagement;