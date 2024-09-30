import { classNames } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumsRepaymentFN(onOpen: () => void) {
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
            {info.row.original?.name} 
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <p>Repayment Amount</p>
      ),
      cell: (info) => (
       <div className="">
        <p>{info.row.original?.amount}</p>
       </div>
      ),
    }),
    columnHelper.accessor("date", {
        header: ({ column }) => (
          <p>Due Date</p>
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
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Status</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className={classNames(
            info?.row?.original?.status === "Overdue" 
            ? "bg-[#FFFAEB] text-[#F79009]" 
            : info?.row?.original?.status === "Paid"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-gray-500", 
            " max-w-min p-1 px-2 rounded-2xl text-sm"
            )}>
                <span className="w-3 h-3 rounded-full">•</span>
                {" "}
               {info?.row?.original?.status}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("vendor", {
        header: ({ column }) => (
          <p>Payment Date</p>
        ),
        cell: (info) => (
         <div className="">
          <p>{info.row.original?.payment_date}</p>
         </div>
        ),
    }),
    columnHelper.accessor("vendor", {
        header: ({ column }) => (
          <p>Loan Amount</p>
        ),
        cell: (info) => (
         <div className="">
            <p>{info.row.original?.loan_amount}</p>
         </div>
        ),
    }),
  ];
}
