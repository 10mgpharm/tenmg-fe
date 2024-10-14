import { classNames } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumsApplicationFN(onOpen: () => void) {
  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>Application ID</p>
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
        <p>Customer Name</p>
      ),
      cell: (info) => (
       <div className="">
        <p>{info.row.original?.name}</p>
       </div>
      ),
    }),
    columnHelper.accessor("loan_amount", {
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
          <p>Date Submitted</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p className="text-gray-500">{info?.row?.original?.date}</p>
            </div>
          );
        },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Loan Status</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className={classNames(
            info?.row?.original?.status === "Awaiting Approval" 
            ? "bg-[#FFFAEB] text-[#F79009]" 
            : info?.row?.original?.status === "Approved"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : info?.row?.original?.status === "Rejected"
            ? "text-red-500 bg-red-50"
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
    columnHelper.accessor("status", {
        header: ({ column }) => (
          <p>Action</p>
        ),
        cell: (info) => (
         <div className="flex items-center gap-3">
            <p className="text-primary-600 font-medium">View</p>
            {
                info?.row?.original?.status === "Awaiting Approval" &&
                <>
                <p className="text-primary-600 font-medium">Edit</p>
                <p className="text-green-600 font-medium">Approve</p>
                </> 
            }
         </div>
        ),
    }),
  ];
}
