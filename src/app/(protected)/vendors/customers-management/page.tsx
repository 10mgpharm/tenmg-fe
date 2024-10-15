"use client";

import { useState } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { IoListOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import {
  Button,
  Checkbox,
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
  useDisclosure,
} from "@chakra-ui/react";
import {
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { ColumnsCustomerFN } from "./components/table";
import Link from "next/link";
import FilterDrawer from "../../suppliers/products/components/FilterDrawer";
import Pagination from "../../suppliers/components/Pagination";
import { customersManagementData } from "@/data/mockdata";
import EmptyOrder from "../../suppliers/orders/components/EmptyOrder";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import DeleteModal from "../../suppliers/products/components/DeleteModal";
import RestockModal from "../../suppliers/products/components/RestockModal";
import DeactiveModal from "../../suppliers/products/components/DeactiveModal";
import UploadModel from "./components/UploadModel";

const CustomersManagment = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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

  const table = useReactTable({
    data: customersManagementData,
    columns: ColumnsCustomerFN(),
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
    <div className="p-8">
      <h3 className="font-semibold text-2xl">Customers Management</h3>
      <div className="flex justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-3 mt-5">
            <div className="border border-gray-300 rounded-md flex items-center gap-3 p-3 w-[350px]">
              <CiSearch className="w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a user"
                className="outline-none flex-1 placeholder:text-gray-400 bg-transparent"
              />
            </div>
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
        {customersManagementData?.length === 0 ? (
          <EmptyOrder
            heading={`No Customer Management Yet`}
            content={`You currently have no repayment history. All repayment history will appear here.`}
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
                    {/* <Flex justifyContent="space-between" alignItems="center"> */}
                      {/* <Button
                        variant="outline"
                        color="gray.500"
                        leftIcon={<FaArrowLeft />}
                      >
                        Previous
                      </Button> */}
                      <Pagination />
                      {/* <Button
                        variant="outline"
                        color="gray.500"
                        rightIcon={<FaArrowRight />}
                      >
                        Next
                      </Button> */}
                    {/* </Flex> */}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </div>
      <UploadModel isOpen={isOpen} onClose={onClose} />
      {/* <RestockModal isOpen={isOpenRestock} onClose={onCloseRestock} />
      <DeactiveModal isOpen={isOpenDeactivate} onClose={onCloseDeactivate} />
      <FilterDrawer isOpen={isOpenFilter} onClose={onCloseFilter} /> */}
    </div>
  );
};

export default CustomersManagment;
