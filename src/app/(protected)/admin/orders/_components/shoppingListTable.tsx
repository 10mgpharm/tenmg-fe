"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
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
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";

import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import { ShoppingListColumsOrderFN } from "./shoppingListColumn";
import Image from "next/image";
import { ShoppingList, ShoppingListData } from "@/types/shoppingList";

interface ShoppingListTableProps {
  data: ShoppingListData;
  loading: boolean;
  pageCount: number;
  setPageCount: Dispatch<SetStateAction<number>>;
}

const ShoppingListTable = ({
  data: shoppinglistData,
  loading,
  pageCount,
  setPageCount,
}: ShoppingListTableProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ShoppingList>();

  const {
    isOpen: isOpenDetails,
    onClose: onCloseDetials,
    onOpen: onOpenDetails,
  } = useDisclosure();

  const memoizedData = useMemo(
    () => shoppinglistData?.data,
    [shoppinglistData]
  );

  const table = useReactTable({
    data: memoizedData,
    columns: ShoppingListColumsOrderFN(
      pageCount,
      20,
      onOpenDetails,
      setSelectedProduct
    ),

    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="md" />
      </Flex>
    );
  }

  return (
    <div>
      {shoppinglistData?.data?.length === 0 ? (
        <EmptyOrder
          heading={`No Shopping List Yet`}
          content={`You currently have no shopping list. All shopping list orders will appear here.`}
        />
      ) : (
        shoppinglistData?.data?.length > 0 && (
          <TableContainer border={"1px solid #F9FAFB"} borderRadius={"10px"}>
            <Table>
              <Thead bg={"#F2F4F7"}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
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
            <Pagination
              meta={shoppinglistData.meta}
              setPageCount={setPageCount}
            />
          </TableContainer>
        )
      )}

      {/* product details modal */}
      <Drawer
        isOpen={isOpenDetails}
        placement="right"
        onClose={() => {
          onCloseDetials();
        }}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Product Details</DrawerHeader>
          <DrawerBody>
            <Image
              src={selectedProduct?.image}
              width={1000}
              height={1000}
              alt="Product image"
              className="max-h-[300px] aspect-square rounded-md bg-gray-100"
            />
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-semibold text-[18px]">
                {selectedProduct?.productName}{" "}
                <span className="text-[15px] text-gray-500 font-normal">
                  | {selectedProduct?.brandName}{" "}
                </span>
              </h2>
            </div>

            <p className="pb-[20px] pt-[15px] text-[15px] text-gray-600">
              {selectedProduct?.description}
            </p>

            <div>
              <h3 className="font-semibold text-[15px]">
                Expected Purchase Date:
              </h3>
              <p className="text-[15px] text-gray-800 font-normal">
                {selectedProduct?.purchaseDate}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-[15px]">Customer Name:</h3>
              <p className="text-[15px] text-gray-800 font-normal">
                {selectedProduct?.customer.name}
              </p>
              <p className="text-[15px] text-gray-500">
                {selectedProduct?.customer.businessName}
              </p>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ShoppingListTable;
