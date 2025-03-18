"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
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

import { NextAuthUserSession, OrderData, OrderResponseData } from "@/types";
import Pagination from "@/app/(protected)/suppliers/_components/Pagination";
import ModalWrapper from "@/app/(protected)/suppliers/_components/ModalWrapper";
import EmptyOrder from "@/app/(protected)/suppliers/orders/_components/EmptyOrder";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import {
  ShoppingListColumsOrderFN,
  shoppingListType,
} from "./shoppingListColumn";
import Image from "next/image";
import { ShoppingListData } from "@/types/shoppingList";

interface OrderPageProp {
  data: ShoppingListData;
  type: string;
  fetchOrders: () => void;
  loading: boolean;
  pageCount: number;
  globalFilter: string;
  fetchOrderCount?: () => void;
  setPageCount: Dispatch<SetStateAction<number>>;
}

const ShoppingListTable = ({
  data: shoppinglistData,
  type,
  loading,
  pageCount,
  setPageCount,
  globalFilter,
  fetchOrders,
  fetchOrderCount,
}: OrderPageProp) => {
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData>();

  const {
    isOpen: isOpenDetails,
    onClose: onCloseDetials,
    onOpen: onOpenDetails,
  } = useDisclosure();

  const memoizedData = useMemo(() => shoppinglistData.data, [shoppinglistData]);

  const table = useReactTable({
    data: memoizedData,
    columns: ShoppingListColumsOrderFN(
      pageCount,
      20,
      type,
      onOpenDetails,
      setSelectedOrder
    ),
    onSortingChange: setSorting,
    state: {
      globalFilter,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // const handleStatusChange = async (status: string) => {
  //   try {
  //     setIsLoading(true);
  //     let formdata: any;
  //     if (status === "processing") {
  //       formdata = {
  //         orderId: selectedOrder.id,
  //         status: "PROCESSING",
  //         requiresRefund: false,
  //       };
  //     } else if (status === "shipping") {
  //       formdata = {
  //         orderId: selectedOrder.id,
  //         status: "SHIPPED",
  //         requiresRefund: false,
  //       };
  //     } else if (status === "cancelled" && comment) {
  //       formdata = {
  //         orderId: selectedOrder.id,
  //         status: "CANCELED",
  //         reason: comment,
  //         requiresRefund: true,
  //         refundStatus: "AWAITING REFUND",
  //       };
  //     } else if (status === "refunded") {
  //       formdata = {
  //         orderId: selectedOrder.id,
  //         status: "CANCELED",
  //         reason: "refunded",
  //         requiresRefund: true,
  //         refundStatus: "REFUNDED",
  //       };
  //     } else if (status === "completed") {
  //       formdata = {
  //         orderId: selectedOrder.id,
  //         status: "COMPLETED",
  //         requiresRefund: false,
  //       };
  //     }
  //     const response = await requestClient({ token: token }).post(
  //       `/admin/orders/change-order-status`,
  //       formdata
  //     );
  //     if (response.status === 200) {
  //       toast.success(response?.data?.message);
  //       fetchOrders();
  //       fetchOrderCount();
  //       onCloseShip();
  //       onCloseProcess();
  //       onCloseRefunded();
  //       onCloseCancelled();
  //       onCloseComplete();
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setIsLoading(false);
  //     toast.error(handleServerErrorMessage(error));
  //   }
  // };

  // const handleSubmit = (e: any) => {
  //   e.preventDefault();
  //   if (comment === "") {
  //     return setError(true);
  //   } else {
  //     handleStatusChange("cancelled");
  //   }
  // };

  // if (loading) {
  //   return (
  //     <Flex justify="center" align="center" height="200px">
  //       <Spinner size="xl" />
  //     </Flex>
  //   );
  // }

  return (
    <div>
      {shoppinglistData.data?.length === 0 ? (
        <EmptyOrder
          heading={`No Shopping List Yet`}
          content={`You currently have no shopping list. All shopping list orders will appear here.`}
        />
      ) : (
        shoppinglistData.data?.length > 0 && (
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
            <Pagination meta={""} setPageCount={setPageCount} />
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
              src={"/assets/images/supplier.png"}
              width={1000}
              height={1000}
              alt="Product image"
              className="max-h-[300px] aspect-square rounded-md"
            />
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-semibold text-[18px]">
                Diclofenac 234 20 Gram
              </h2>

              <span className="text-[15px] text-gray-500">2025-03-20 </span>
            </div>

            <p className="py-[20px] text-[15px] text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Recusandae dolore similique esse, suscipit eveniet cum inventore,
              nisi exercitationem repellendus libero laudantium voluptas maiores
              quae totam assumenda perspiciatis earum tempora ipsam?
            </p>

            <div>
              <h3 className="font-semibold text-[15px]">Customer Name:</h3>
              <p className="text-[15px] text-gray-800 font-normal">
                Onyejekwe ugonna
              </p>
              <p className="text-[15px] text-gray-500">Evans 2</p>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ShoppingListTable;
