import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@/utils";

const columnHelper = createColumnHelper<any>();

export function ColumsCompletedFN(onOpen: () => void, onOpenDeactivate: () => void) {

  return [
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <p className="pl-6">Supplier Name</p>
      ),
      cell: (info) => {
        return (
          <div className="pl-6">
           <p>{info?.row?.original?.name}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("transaction_type", {
      header: ({ column }) => (
        <p className="">Transaction Type</p>
      ),
      cell: (info) => (
       <div className="">
        <p className="font-medium capitalize">{info.row.original?.transaction_type}</p>
       </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <p className="">Amount</p>
      ),
      cell: (info) => (
       <div className="">
        <p className="font-medium">{info.row.original?.amount}</p>
       </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: ({ column }) => (
        <p className="">Date</p>
      ),
      cell: (info) => (
       <div className="">
        <p className="font-medium">{info.row.original?.date}</p>
       </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Status</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className={classNames(
            info?.row?.original?.status === "Failed" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : (info?.row?.original?.status === "Completed" || info?.row?.original?.status === "Successful")
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-orange-500 bg-orange-50", " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
            )}>
              <span className="rounded-full text-[1.2rem]">•</span>
              {" "}
               {info?.row?.original?.status}
            </p>
          </div>
        );
      },
    })
  ];
}
