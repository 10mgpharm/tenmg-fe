import { ApplicationDto } from "@/types";
import { classNames } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<ApplicationDto>();

export function ColumsApplicationFN() {
  return [
    columnHelper.accessor("id", {
      header: ({ column }) => <p className="pl-4">S/N</p>,
      cell: (info) => {
        const serialNumber = info?.row?.index + 1;
        return (
          <div className="pl-4">
            <p>{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("identifier", {
      header: () => (
        <div className="pl-4">
          <p>Application ID</p>
        </div>
      ),
      cell: (info) => (
        <div
          onClick={() => {}}
          className="flex flex-col gap-2 pl-4 justify-start"
        >
          <p className="text-gray-500">{info.row.original?.identifier}</p>
          <span className="text-gray-700 text-xs">
            {convertDate(info.row.original?.createdAt)}{" "}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("customer.name", {
      header: ({ column }) => <p className="pl-4">Customer Name</p>,
      cell: (info) => (
        <div className="pl-4">
          <p className="font-medium">{info.row.original?.customer.name}</p>
        </div>
      ),
    }),
    columnHelper.accessor("requestedAmount", {
      header: ({ column }) => <p className="pl-4">Loan Amount</p>,
      cell: (info) => (
        <div className="pl-4">
          <p className="font-medium">
            {formatAmount(info.row.original?.requestedAmount)}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("customer.email", {
      header: ({ column }) => <p className="pl-4">Vendor</p>,
      cell: (info) => {
        return (
          <div className="pl-4">
            <p className="font-medium">{info?.row?.original?.business.name}</p>
          </div>
        );
      },
    }),

    columnHelper.accessor("customer.score", {
      header: ({ column }) => <p className="pl-4">Credit Score</p>,
      cell: (info) => {
        return (
          <div className="pl-4">
            <p className="font-medium flex justify-center">
              {info?.row?.original?.customer.score}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <p className="pl-4">Status</p>,
      cell: (info) => {
        return (
          <div className="pl-4">
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
    columnHelper.accessor("customer.id", {
      header: ({ column }) => <p className="px-4">Action</p>,
      cell: (info) => (
        <div className="flex items-center gap-3 px-4">
          <Link
            href={`/admin/loan-application/view/${info.row.original?.identifier}`}
            className="text-primary-600 font-medium cursor-pointer "
          >
            View
          </Link>
        </div>
      ),
    }),
  ];
}
