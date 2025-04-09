import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { classNames, formatText } from "@/utils";

const columnHelper = createColumnHelper<any>();

export function ColumsFN() {
  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>Loan ID</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">
            {info.row.original?.identifier} 
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Customer</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p>{info.row.original?.customer?.name} </p>
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: ({ column }) => (
        <p>Email Address</p>
      ),
      cell: (info) => {
        return (
        <div>
            <p>{info.row.original?.customer?.email}</p>
        </div>
        );
      },
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <p>Loan Amount</p>
      ),
      cell: (info) => (
       <div>
        <p>₦{Number(info.row.original?.totalAmount)?.toLocaleString()}</p>
       </div>
      ),
    }),
    columnHelper.accessor("disbursementStatus", {
      header: ({ column }) => (
        <p>Vendor</p>
      ),
      cell: (info) => {
        return (
          <div >
           <p>{info.row.original?.business?.name}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Repayment Status</p>
      ),
      cell: (info) => {
        return (
        <div>
            <p className={classNames(
            info?.row?.original?.status === "Pending" 
            ? "bg-[#FFFAEB] text-[#F79009]" 
            : info?.row?.original?.status === "Cancelled" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "DISBURSED"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-gray-500", " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
            )}>
                <span className="text-[1.2rem] rounded-full">•</span>
                {" "}
                {formatText(info?.row?.original?.status)}
            </p>
        </div>

        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Action</p>
      ),
      cell: (info) => {
        return (
          <div>
            <Link href={'/admin/loan-management/detail'} className="text-primary-600 font-medium"> View</Link>
          </div>
        );
      },
    }),
  ];
}
