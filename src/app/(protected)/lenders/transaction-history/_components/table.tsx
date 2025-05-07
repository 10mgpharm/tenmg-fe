import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { classNames, formatAmountString } from "@/utils";
import { BsThreeDotsVertical } from "react-icons/bs";

import { Dispatch, SetStateAction } from "react";
import { LenderTransactionHistoryData } from "@/types";
import { convertDate } from "@/utils/formatDate";
import TransactionHistoryDrawer from "../../_components/TransactionHistoryDrawer";

const columnHelper = createColumnHelper<LenderTransactionHistoryData>();

export function ColumnsTransactionHistoryFN(onOpen?: () => void) {
  return [
    columnHelper.accessor("identifier", {
      header: () => (
        <div className="">
          <p>Transaction ID</p>
        </div>
      ),
      cell: (info) => {
        return (
          <div className="">
            <p className="font-medium">{info?.row?.original?.identifier}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("createdAt", {
      header: () => (
        <div className="">
          <p>Date</p>
        </div>
      ),
      cell: (info) => (
        <div className="flex items-center gap-2">
          <p>{convertDate(info?.row?.original?.createdAt)}</p>
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => <p>Description</p>,
      cell: (info) => {
        return (
          <div>
            <p className="capitalize font-medium">
              {info?.row?.original?.description}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("type", {
      header: ({ column }) => <p>Type</p>,
      cell: (info) => {
        return (
          <div>
            <p className="font-medium">{info?.row?.original?.type}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => <p>Amount</p>,
      cell: (info) => {
        return (
          <div>
            <p className="font-medium capitalize">
              ₦{formatAmountString(info?.row?.original?.amount)}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <p className="px-5">Payment Status</p>,
      cell: (info) => (
        <div className="px-5">
          <p
            className={classNames(
              info?.row?.original?.status === "success"
                ? "text-[#027A48] bg-[#ECFDF3]"
                : "bg-[#FEF3F2] text-[#B42318]",
              " max-w-min p-0.5 px-2 rounded-2xl capitalize text-[11px] font-medium"
            )}
          >
            <span className="text-[1.2rem] rounded-full">•</span>{" "}
            {info?.row?.original?.status === "success"
              ? "Successful"
              : "Failed"}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => <p>Action</p>,
      cell: (info) => {
        return (
          <div>
            <TransactionHistoryDrawer />
          </div>
        );
      },
    }),
  ];
}
