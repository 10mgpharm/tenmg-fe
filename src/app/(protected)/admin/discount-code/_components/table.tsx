import { createColumnHelper } from "@tanstack/react-table";
import { Flex } from "@chakra-ui/react";
import Link from "next/link";
import { classNames } from "@/utils";
import { DiscountDataType } from "@/types";

const columnHelper = createColumnHelper<DiscountDataType>();

export function ColumsDiscountFN(
  onOpen: () => void,
  pageIndex: number, 
  pageSize: number, 
) {
  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>S/N</p>
        </div>
      ),
      cell: (info) => {
        const serialNumber = pageIndex > 1 ? (pageIndex - 1) * pageSize + info?.row.index + 1 : info?.row.index + 1;
        return(
          <div>
            <p className="pl-6 font-semibold">
              {serialNumber}
            </p>
          </div>
        )
      }
    }),
    columnHelper.accessor("type", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Title</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p className="font-medium">{info.row.original?.type} </p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <p>Value</p>
      ),
      cell: (info) => {
        return (
          <div>
           <p className="font-medium">{info?.row?.original?.amount}</p>
          </div>
        );
      },
  }),
    columnHelper.accessor("couponCode", {
      header: ({ column }) => (
        <p>Discount Code</p>
      ),
      cell: (info) => (
       <div className="">
        <p className="font-medium pl-4">{info.row.original?.couponCode}</p>
       </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Status</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className={classNames(
            info?.row?.original?.status === "INACTIVE" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "ACTIVE"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-gray-500", 
            " max-w-min p-1 px-2 rounded-2xl text-xs font-semibold"
            )}>
                <span className="w-3 h-3 rounded-full">•</span>
                {" "}
               {info?.row?.original?.status}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("applicationMethod", {
        header: ({ column }) => (
          <p>Method</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p className="font-medium">{info?.row?.original?.applicationMethod}</p>
            </div>
          );
        },
    }),
    columnHelper.accessor("customerLimit", {
        header: ({ column }) => (
          <p>Customer Limit</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p className="font-medium">{info?.row?.original?.customerLimit}</p>
            </div>
          );
        },
    }),
    columnHelper.accessor("endDate", {
        header: ({ column }) => (
          <p>End Date</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p className="font-medium">{info?.row?.original?.endDate}</p>
            </div>
          );
        },
    }),
  ];
}
