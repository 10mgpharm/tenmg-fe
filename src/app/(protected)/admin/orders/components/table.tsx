import { createColumnHelper } from "@tanstack/react-table";
import { Flex } from "@chakra-ui/react";
import Link from "next/link";
import { classNames } from "@/utils";

const columnHelper = createColumnHelper<any>();

export function ColumsOrderFN(onOpen: () => void) {

  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>S/N</p>
        </div>
      ),
      cell: (info) => (
        <div
          onClick={() => {
            onOpen();
          }}
        >
          <p className="pl-6">
            {info.row.original?.id} 
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Customer Name</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p>{info.row.original?.name} </p>
        </div>
      ),
    }),
    columnHelper.accessor("orderId", {
      header: ({ column }) => (
        <p>Order ID</p>
      ),
      cell: (info) => (
       <div className="">
        <p>{info.row.original?.orderId}</p>
       </div>
      ),
    }),
    columnHelper.accessor("cost", {
      header: ({ column }) => (
        <p>Cost</p>
      ),
      cell: (info) => (
       <div className="">
        <p>{info.row.original?.cost}</p>
       </div>
      ),
    }),
    columnHelper.accessor("date", {
        header: ({ column }) => (
          <p>Date</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p>{info?.row?.original?.date}</p>
             <p className="text-gray-500">{info?.row?.original?.time}</p>
            </div>
          );
        },
    }),
    columnHelper.accessor("isPublic", {
      header: ({ column }) => (
        <p>Status</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className={classNames(
            info?.row?.original?.status === "Pending" 
            ? "bg-[#FFFAEB] text-[#F79009]" 
            : info?.row?.original?.status === "Cancelled" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "Shipped"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : info?.row?.original?.status === "Completed"
            ? "text-blue-500 bg-blue-50"
            : "text-gray-500", 
            " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
            )}>
                <span className="rounded-full text-[1.2rem]">•</span>
                {" "}
               {info?.row?.original?.status}
            </p>
          </div>
        );
      },
    }),
  ];
}
