import { CustomerData } from "@/types";
import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();

export function ColumnsTransactionFN() {
  return [
    columnHelper.accessor("reference", {
      header: () => (
        <div className="pl-6">
          <p>Evaluation Reference</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">{info.row.original?.ref}</p>
          <p className="pl-6">{info.row.original?.date}</p>
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
          <p className="font-bold">{info.row.original?.customer} </p>
          <p className="">{info.row.original?.email}</p>
        </div>
      ),
    }),

    // Contact Information

    columnHelper.accessor("sources", {
      header: () => <p>Document Source</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.sources}</p>
        </div>
      ),
    }),

    // Date Created

    columnHelper.accessor("status", {
      header: () => <p>Account Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.active === 1
                ? "text-[#027A48] bg-[#ECFDF3]"
                : info?.row?.original?.active === "0"
                ? "bg-[#FEF3F2] text-[#B42318]"
                : "text-gray-500",
              " max-w-min p-1 px-2 rounded-2xl text-xs font-medium items-center justify-center flex gap-1"
            )}
          >
            {" "}
            <span className="rounded-full text-[1.2rem]">•</span>
            {info.row.original?.active === 1 ? "Success" : "Failed"}
          </p>
        </div>
      ),
    }),

    // Status
    columnHelper.accessor("actions", {
      header: () => <p>Actions</p>,
      cell: (info) => (
        <div>
          <p>{info?.row?.original?.action}</p>
        </div>
      ),
    }),
  ];
}
