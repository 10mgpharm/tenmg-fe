import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@/utils";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

type DataType = {
  id: string;
  date: string;
  description: string;
  amountPaid: number;
  paymentStatus: string;
};

const columnHelper = createColumnHelper<DataType>();

export function TransactionColumn(onOpen: () => void) {
  return [
    columnHelper.accessor("id", {
      header: ({ column }) => <p className="pl-6"> S/N</p>,
      cell: (info) => {
        const serialNumber = info?.row?.index + 1;
        return (
          <div className="pl-6">
            <p>{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => <p className="pl-6"> Transaction ID</p>,
      cell: (info) => {
        return (
          <div className="pl-6">
            <p>{info?.row?.original?.id}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("date", {
      header: ({ column }) => <p className="">Date</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium capitalize">{info.row.original?.date}</p>
        </div>
      ),
    }),

    columnHelper.accessor("description", {
      header: ({ column }) => <p className="">Description</p>,
      cell: (info) => <div className="">{info.row.original?.description}</div>,
    }),

    columnHelper.accessor("amountPaid", {
      header: ({ column }) => <p className="">Amount Paid</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">₦{info.row.original?.amountPaid}</p>
        </div>
      ),
    }),

    columnHelper.accessor("paymentStatus", {
      header: ({ column }) => <p>Payment Status</p>,
      cell: (info) => {
        return (
          <div>
            <p
              className={classNames(
                info?.row?.original?.paymentStatus === "failed"
                  ? "bg-[#FEF3F2] text-[#B42318]"
                  : info?.row?.original?.paymentStatus === "successful"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : "text-orange-500 bg-orange-50",
                " max-w-min p-1 px-2 rounded-2xl text-sm font-medium capitalize"
              )}
            >
              <span className="rounded-full text-[1.2rem]">•</span>{" "}
              {info?.row?.original?.paymentStatus}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => <p className="text-center">Actions</p>,
      cell: (info) => {
        return (
          <p
            className="font-medium text-primary-600 cursor-pointer"
            onClick={onOpen}
          >
            View
          </p>
        );
      },
    }),
  ];
}
