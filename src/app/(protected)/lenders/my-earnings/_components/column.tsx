import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@/utils";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

type dataType = {
  loanId: string;
  BorrowerName: string;
  loanAmount: number;
  projectedInterest: number;
  repaidInterest: number;
  balanceInterest: number;
  id: string;
};

const columnHelper = createColumnHelper<dataType>();

export function MyEarningsColumn(
  onOpenDetails: () => void,
  setSelectedUserId: (value: string) => void
) {
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
    columnHelper.accessor("loanId", {
      header: ({ column }) => <p className="pl-6">Loan ID</p>,
      cell: (info) => {
        return (
          <div className="pl-6">
            <p>{info?.row?.original?.loanId}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("BorrowerName", {
      header: ({ column }) => <p className="">{"Borrower's Name"}</p>,
      cell: (info) => (
        <div className="">
          <p className=" capitalize">{info.row.original?.BorrowerName}</p>
        </div>
      ),
    }),
    columnHelper.accessor("loanAmount", {
      header: ({ column }) => <p className="">Loan Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="">₦{info.row.original?.loanAmount}</p>
          <span className="text-primary-700 text-[12px]">
            Loan Interest: 200.00
          </span>
        </div>
      ),
    }),

    columnHelper.accessor("repaidInterest", {
      header: ({ column }) => <p className="">Repaid Interest</p>,
      cell: (info) => (
        <div className="">
          <p className="">₦{info.row.original?.repaidInterest}</p>
        </div>
      ),
    }),

    columnHelper.accessor("id", {
      header: ({ column }) => <p className="">Actions</p>,
      cell: (info) => {
        return (
          <div className="">
            <p
              className="cursor-pointer text-primary-600 font-medium"
              onClick={() => {
                onOpenDetails();
                setSelectedUserId(info.row.original.id);
              }}
            >
              View
            </p>
          </div>
        );
      },
    }),
  ];
}
