import { ApplicationDto, LoanData } from "@/types";
import { classNames } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<ApplicationDto>();

export function ColumnsLoanApplicationFN(pageNumber: number) {
  return [
    columnHelper.accessor("id", {
      header: ({ column }) => <p className="pl-6">S/N</p>,
      cell: (info) => {
        const serialNumber = (pageNumber - 1) * 10 + info?.row?.index + 1;
        return (
          <div className="pl-6">
            <p>{serialNumber}</p>
          </div>
        );
      },
    }),

    columnHelper.accessor("identifier", {
      header: () => (
        <div className="">
          <p>Application ID</p>
        </div>
      ),
      cell: (info) => (
        <div onClick={() => {}} className="flex flex-col gap-2  justify-start">
          <p className="text-gray-500">{info.row.original?.identifier}</p>
          <span className="text-gray-700 text-xs">
            {convertDate(info.row.original?.createdAt)}{" "}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("customer.name", {
      header: ({ column }) => <p>Customer Name</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">{info.row.original?.customer?.name}</p>
        </div>
      ),
    }),
    columnHelper.accessor("requestedAmount", {
      header: ({ column }) => <p>Loan Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {formatAmount(info.row.original?.requestedAmount)}
          </p>
        </div>
      ),
    }),

    columnHelper.accessor("customer.score", {
      header: ({ column }) => <p>Credit Score</p>,
      cell: (info) => {
        return (
          <div>
            <p className="font-medium">
              {info?.row?.original?.customer?.score}
            </p>
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
                info.row.original.status === "EXPIRED"
                  ? "bg-[#FEF3F2] text-[#B42318]"
                  : info?.row?.original?.status === "APPROVED"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : info.row.original?.status === "INITIATED"
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-500",
                " max-w-min p-0.5 px-2 rounded-2xl text-sm capitalize font-medium"
              )}
            >
              <span className="text-[1.2rem] rounded-full">•</span>{" "}
              {info.row.original?.status}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => <p>Action</p>,
      cell: (info) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/vendors/loan-applications/${info.row.original?.id}`}
            className="text-primary-600 font-medium cursor-pointer "
          >
            View
          </Link>
        </div>
      ),
    }),
  ];
}
