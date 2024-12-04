import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();

export function ColumnsCreditScoreFN() {
  return [
    columnHelper.accessor("identifier", {
      header: () => (
        <div className="pl-6">
          <p>Reference ID</p>
        </div>
      ),
      cell: (info) => (
        <div className="pl-6">
          <p>{info.row.original?.id}</p>
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
    columnHelper.accessor("email", {
      header: () => <p>Contact Information</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor("score", {
      header: () => <p>Credit Score</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.score}</p>
        </div>
      ),
    }),
    columnHelper.accessor("percentage", {
      header: () => <p>Percentage</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.percentage}</p>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: () => <p>Account Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.status === "Active"
                ? "text-[#027A48] bg-[#ECFDF3]"
                : info?.row?.original?.status === "Suspended"
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
    columnHelper.accessor("id", {
      header: () => <p>Actions</p>,
      cell: (info) => {
        return (
          <div className="flex gap-4">
            <Link 
            href={`/vendors/transactions-history/${info.row.original?.customerId}`} 
            className="text-primary font-medium">
                View
            </Link>
          </div>
        );
      },
    }),
  ];
}
