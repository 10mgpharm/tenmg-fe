import { UserLoan } from "@/types";
import { classNames } from "@/utils";
import { Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";

const columnHelper = createColumnHelper<UserLoan>();

export function ColumnsLoanFN() {
  return [
    columnHelper.accessor("loanId", {
      header: () => (
        <div className="pl-6">
          <p>Ref ID</p>
        </div>
      ),
      cell: (info) => (
        <div className="pl-6">
          <p className="text-gray-500">{info.row.original?.loanId}</p>
          <p className="text-gray-700 text-xs">{info.row.original?.date}</p>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: () => (
        <div>
          <p>Customer Name</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.row.original?.name} </p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: () => (
        <div>
          <p>Loan Amount</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.row.original?.amount}</p>
        </div>
      ),
    }),

    columnHelper.accessor("vendor", {
      header: () => (
        <div>
          <p>Vendor</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.row.original?.vendor}</p>
        </div>
      ),
    }),
    columnHelper.accessor("score", {
      header: () => (
        <div>
          <p>Credit Score</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.row.original?.score}</p>
        </div>
      ),
    }),

    columnHelper.accessor("repaymentStatus", {
      header: () => (
        <div>
          <p>Status</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info.row.original.repaymentStatus === "Late Payment"
                ? "bg-[#FEF3F2] text-[#B42318]"
                : info?.row?.original?.repaymentStatus === "Complete"
                ? "text-[#027A48] bg-[#ECFDF3]"
                : info.row.original?.repaymentStatus === "Ongoing"
                ? "bg-orange-50 text-orange-500"
                : "text-gray-500",
              " max-w-min p-0.5 px-2 rounded-2xl text-sm capitalize font-medium"
            )}
          >
            <span className="text-[1.2rem] rounded-full">•</span>{" "}
            {info.row.original?.repaymentStatus}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("repaymentStatus", {
      header: () => (
        <div>
          <p>Actions</p>
        </div>
      ),
      cell: (info) => (
        // <div>
        //   <Link href={'/vendors/loan-management/view'} className="font-medium text-primary-500">View</Link>
        // </div>
        <Menu>
          <MenuButton>
            <BsThreeDotsVertical className="w-5 h-auto" />
          </MenuButton>
          <MenuList>
            <MenuItem mb={2}>
              {" "}
              <Link
                href={"/lenders/loan-application/view"}
                className="font-medium text-primary-500"
              >
                View
              </Link>
            </MenuItem>
            <MenuItem mb={2}>Approve</MenuItem>
            <MenuItem color="red.500">Ignore</MenuItem>{" "}
          </MenuList>
        </Menu>
      ),
    }),
  ];
}
