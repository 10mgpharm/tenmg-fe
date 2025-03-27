import { LoanData } from "@/types";
import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();

export function ColumnsLoanApplicationFN() {
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
      header: () => (
        <div className="pl-6">
          <p>Ref ID</p>
        </div>
      ),
      cell: (info) => (
        <div onClick={() => {}} className="flex flex-col gap-2  justify-start">
          <p className=" font-[500]">#{info.row.original?.id}</p>
          <span className="text-[13px] text-gray-600">
            {convertDate(info.row.original?.dateApplied)}{" "}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("customerName", {
      header: ({ column }) => <p>Customer Name</p>,
      cell: (info) => (
        <div className="">
          <p>{info.row.original?.customerName}</p>
        </div>
      ),
    }),
    columnHelper.accessor("loanAmount", {
      header: ({ column }) => <p>Loan Amount</p>,
      cell: (info) => (
        <div className="">
          <p>₦{info.row.original?.loanAmount}</p>
        </div>
      ),
    }),

    columnHelper.accessor("vendor", {
      header: ({ column }) => <p>Credit Score</p>,
      cell: (info) => {
        return (
          <div>
            <p className="text-gray-500">{info?.row?.original?.creditScore}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <p>Status</p>,
      cell: (info) => {
        return (
          <div>
            <p
              className={classNames(
                info?.row?.original?.status === "Awaiting Approval"
                  ? "bg-[#FFFAEB] text-[#F79009]"
                  : info?.row?.original?.status === "Approved"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : info?.row?.original?.status === "Rejected"
                  ? "text-red-500 bg-red-50"
                  : "text-gray-500",
                "max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
              )}
            >
              <span className="text-[1.2rem] rounded-full">•</span>{" "}
              {info?.row?.original?.status}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => <p>Action</p>,
      cell: (info) => (
        <div className="flex items-center gap-3 px-4">
          <p className="text-primary-600 font-medium cursor-pointer ">View</p>
        </div>
      ),
    }),
  ];
}
