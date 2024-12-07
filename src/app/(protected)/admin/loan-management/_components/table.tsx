import Link from "next/link";
import { classNames } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumsLoanFN(onOpen: () => void) {
  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>Loan ID</p>
        </div>
      ),
      cell: (info) => (
        <div
          onClick={() => {
            onOpen();
          }}
        >
          <p className="pl-6">
            {info.row.original?.id} 
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Customer Name</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p>{info.row.original?.name} </p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <p>Loan Amount</p>
      ),
      cell: (info) => (
       <div className="">
        <p>{info.row.original?.amount}</p>
       </div>
      ),
    }),
    columnHelper.accessor("date", {
        header: ({ column }) => (
          <p>Date Created</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p>{info?.row?.original?.date}</p>
             <p className="text-gray-500">{info?.row?.original?.time}</p>
            </div>
          );
        },
    }),
    columnHelper.accessor("disburstment", {
        header: ({ column }) => (
          <p>Disbursement Status</p>
        ),
        cell: (info) => (
         <div className="">
          <p>{info.row.original?.disburstment}</p>
         </div>
        ),
    }),
    columnHelper.accessor("vendor", {
        header: ({ column }) => (
          <p>Vendor Name</p>
        ),
        cell: (info) => (
         <div className="">
          <p>{info.row.original?.vendor}</p>
         </div>
        ),
    }),
    columnHelper.accessor("isPublic", {
      header: ({ column }) => (
        <p>Repayment Status</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className={classNames(
            info?.row?.original?.status === "Pending" 
            ? "bg-[#FFFAEB] text-[#F79009]" 
            : info?.row?.original?.status === "Disabled" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "Enabled"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-gray-500", 
            " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
            )}>
              <span className="rounded-full text-[1.2rem]">•</span>
              {" "}
              {info?.row?.original?.status}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("vendor", {
        header: ({ column }) => (
          <p>Actions</p>
        ),
        cell: (info) => (
         <div className="">
            <Link href={'/admin/loan-management/detail'} className="text-primary-500 font-medium">View</Link>
         </div>
        ),
    }),
  ];
}
