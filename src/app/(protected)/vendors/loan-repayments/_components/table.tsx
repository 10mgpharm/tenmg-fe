import { LoanData } from "@/types";
import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();

export function ColumnsLoanRepaymentFN() {
  return [
    columnHelper.accessor("identifier", {
      header: () => (
        <div className="pl-6">
          <p>Loan ID</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">{info.row.original?.loanId}</p>
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
          <p className="font-bold">{info.row.original?.name} </p>
        </div>
      ),
    }),

    // Contact Information

    columnHelper.accessor("amount", {
      header: () => <p>Loan Amount</p>,
      cell: (info) => (
        <div>
          <p>₦{info.row.original?.amount}</p>
        </div>
      ),
    }),
    columnHelper.accessor("repay", {
      header: () => <p>Repayment Amount</p>,
      cell: (info) => (
        <div>
          <p className="pl-6">₦{info.row.original?.repay}</p>
        </div>
      ),
    }),

    // Date Created

    columnHelper.accessor("date", {
      header: () => <p>Due Date</p>,
      cell: (info) => (
        <div>
          <p>{convertDate(info.row.original?.date || null)}</p>
        </div>
      ),
    }),

    // Status
    columnHelper.accessor("status", {
      header: () => <p>Payment Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.status === "Completed"
                ? "text-[#027A48] bg-[#ECFDF3]"
                : info?.row?.original?.status === "Pending Payment"
                ? "bg-[#FEF3F2] text-[#eaa640]"
                : info?.row?.original?.status === "Payment Overdue"
                ? "bg-[#FEF3F2] text-[#B42318]"
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
    columnHelper.accessor("id", {
      header: () => <p>Action</p>,
      cell: (info) => {
        return (
          <div className="flex gap-4">
            <Link 
            href={`/vendors/loan-repayments/${info.row.original?.loanId}`} 
            className="text-primary font-medium">
              View
            </Link>
          </div>
        );
      },
    }),
  ];
}
