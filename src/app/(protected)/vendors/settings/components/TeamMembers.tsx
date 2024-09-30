"use client";

import { useState } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { IoListOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import {
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

import { ColumnsProductFN } from "./table";
import { PRODUCTVIEW } from "@/app/globalTypes";

import { classNames } from "@/utils";

import Link from "next/link";

import { productData } from "@/data/mockdata";
import Pagination from "@/app/(protected)/suppliers/components/Pagination";

const TeamMembers = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [currentView, setCurrentView] = useState<PRODUCTVIEW>(PRODUCTVIEW.LIST);

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
    data: productData,
    columns: ColumnsProductFN(onOpen, onOpenRestock, onOpenDeactivate),
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
      <div className="flex justify-between">
        <div className="mb-5">
          <h3 className="font-semibold text-2xl">
            Products
            <span className="font-light text-gray-600">(9/40)</span>
          </h3>
          <div className="flex items-center gap-3 mt-5">
            <div className="border border-gray-300 rounded-md flex items-center gap-3 p-3 w-[350px]">
              <CiSearch className="w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a product"
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
          <div
            className={classNames(
              currentView === PRODUCTVIEW.LIST
                ? "bg-primary-50 rounded-md border border-primary-500"
                : "",
              "cursor-pointer p-2"
            )}
            onClick={() => setCurrentView(PRODUCTVIEW.LIST)}
          >
            <IoListOutline
              className={classNames(
                currentView === PRODUCTVIEW.LIST
                  ? "text-primary-500"
                  : "text-gray-600",
                " w-5 h-5"
              )}
            />
          </div>
          <div
            className={classNames(
              currentView === PRODUCTVIEW.GRID
                ? "bg-primary-50 rounded-md border border-primary-500"
                : "",
              "cursor-pointer p-2"
            )}
            onClick={() => setCurrentView(PRODUCTVIEW.GRID)}
          >
            <RxDashboard
              className={classNames(
                currentView === PRODUCTVIEW.GRID
                  ? "text-primary-500"
                  : "text-gray-600",
                " w-5 h-5"
              )}
            />
          </div>
          <Link
            href={"/suppliers/products/new"}
            className="bg-primary-500 text-white p-2 px-5 rounded-md"
          >
            Add Product
          </Link>
        </div>
      </div>
      <div className="">
        {productData?.length === 0 ? (
          " <EmptyOrder />"
        ) : currentView === PRODUCTVIEW.LIST ? (
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
            <Table>
              <Thead bg={"#F2F4F7"}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    <Th textTransform={"initial"} px="0px">
                      <Checkbox
                        _checked={{
                          "& .chakra-checkbox__control": {
                            background: "#1A70B8",
                            // borderColor: "#D0D5DD",
                            borderRadius: 5,
                          },
                        }}
                        marginLeft={5}
                        isChecked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                      />
                    </Th>
                    {headerGroup.headers?.map((header) => (
                      <Th textTransform={"initial"} px="0px" key={header.id}>
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
                    <Td px="0px">
                      <Checkbox
                        _checked={{
                          "& .chakra-checkbox__control": {
                            background: "#1A70B8",
                            // borderColor: "#D0D5DD",
                            borderRadius: 5,
                          },
                        }}
                        marginLeft={5}
                        isChecked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                      />
                    </Td>
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
            <HStack mt={5} justify={"space-between"}>
              <Flex alignItems={"center"} gap={2}>
                <FaChevronLeft className="text-gray-500" />
                <Text className="text-gray-500">Prev</Text>
              </Flex>
              <Pagination />
              <Flex alignItems={"center"} gap={2}>
                <Text className="text-gray-500">Next</Text>
                <FaChevronRight className="text-gray-500" />
              </Flex>
            </HStack>
          </TableContainer>
        ) : (
          "<GridList data={productData} />"
        )}
      </div>
      {/* <DeleteModal isOpen={isOpen} onClose={onClose} />
      <RestockModal isOpen={isOpenRestock} onClose={onCloseRestock} />
      <DeactiveModal isOpen={isOpenDeactivate} onClose={onCloseDeactivate} />
      <FilterDrawer isOpen={isOpenFilter} onClose={onCloseFilter} /> */}
    </div>
  );
};

export default TeamMembers;
