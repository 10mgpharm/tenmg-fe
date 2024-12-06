import { LoanData } from "@/types";
import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<LoanData>();

export function ColumnsLoanApplicationFN() {
  return [
    columnHelper.accessor("identifier", {
      header: () => (
        <div className="pl-6">
          <p>Application ID</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">{info.row.original?.identifier}</p>
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: () => (
        <div>
          <p>Customer Name</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-bold">{info.row.original?.customer?.name} </p>
        </div>
      ),
    }),

    // Contact Information

    columnHelper.accessor("source", {
      header: () => <p>Loan Amount</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.requestedAmount?.toLocaleString()}</p>
        </div>
      ),
    }),

    // Date Created

    columnHelper.accessor("createdAt", {
      header: () => <p>Date Created</p>,
      cell: (info) => (
        <div>
          <p>{convertDate(info.row.original?.createdAt || null)}</p>
        </div>
      ),
    }),

    // Status
    columnHelper.accessor("status", {
      header: () => <p>Loan Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.status === "APPROVED"
                ? "text-[#027A48] bg-[#ECFDF3]"
                : info?.row?.original?.status === "PENDING"
                ? "bg-[#FEF3F2] text-[#eaa640]"
                : "text-gray-500",
              " max-w-min p-1 px-2 rounded-2xl text-xs font-medium items-center justify-center flex gap-1"
            )}
          >
            {" "}
            <span className="rounded-full text-[1.2rem]">•</span>
            {info.row.original?.status}
          </p>
        </div>
      ),
    }),

    // Actions

    columnHelper.accessor("id", {
      header: () => <p>Actions</p>,
      cell: (info) => {
        return (
          <div className="flex gap-4">
            <Link href={`/vendors/loan-applications/${info.row.original?.customer?.id}`} className="text-primary font-medium">View</Link>
            {
              info.row.original?.status === "PENDING" &&
              <div className="flex items-center gap-4">
                <p className="cursor-pointer text-primary-600 font-medium">Edit</p>
                <p className="cursor-pointer text-primary-600 font-medium">Approve</p>
              </div>
            }
          </div>
        );
      },
    }),
  ];
}
