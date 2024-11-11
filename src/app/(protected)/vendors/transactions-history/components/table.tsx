import { TransactionHistoryData } from "@/types";
import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<TransactionHistoryData>();

export function ColumnsTnxHistoryFN() {
  return [
    columnHelper.accessor("identifier", {
      header: () => (
        <div className="pl-6">
          <p>Application ID</p>
        </div>
      ),
      cell: (info) => (
        <div className="pl-6">
          <p>{info.row.original?.identifier}</p>
          <p>{convertDate(info.row.original?.createdAt || null)}</p>
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
          <p className="font-bold">{info.row.original?.customerId} </p>
        </div>
      ),
    }),
    columnHelper.accessor("source", {
      header: () => <p>Document Source</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.source}</p>
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: () => <p>Date Format</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.fileFormat}</p>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: () => <p>Amount Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.status === "DONE"
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
