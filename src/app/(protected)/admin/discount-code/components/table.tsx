import { createColumnHelper } from "@tanstack/react-table";
import { Flex } from "@chakra-ui/react";
import Link from "next/link";
import { classNames } from "@/utils";

const columnHelper = createColumnHelper<any>();

export function ColumsDiscountFN(onOpen: () => void) {

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
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Title</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p>{info.row.original?.title} </p>
        </div>
      ),
    }),
    columnHelper.accessor("discount_code", {
      header: ({ column }) => (
        <p>Discount Code</p>
      ),
      cell: (info) => (
       <div className="">
        <p>{info.row.original?.discount_code}</p>
       </div>
      ),
    }),
    columnHelper.accessor("value", {
        header: ({ column }) => (
          <p>Value</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p>{info?.row?.original?.value}</p>
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
            info?.row?.original?.status === "Expired" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "Active"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-gray-500", 
            " max-w-min p-1 px-2 rounded-2xl text-sm"
            )}>
                <span className="w-3 h-3 rounded-full">•</span>
                {" "}
               {info?.row?.original?.status}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("method", {
        header: ({ column }) => (
          <p>Method</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p>{info?.row?.original?.method}</p>
            </div>
          );
        },
    }),
    columnHelper.accessor("used", {
        header: ({ column }) => (
          <p>Used</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p>{info?.row?.original?.used}</p>
            </div>
          );
        },
    }),
  ];
}
