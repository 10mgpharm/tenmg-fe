import { createColumnHelper } from "@tanstack/react-table";
import { classNames, formatText } from "@/utils";

const columnHelper = createColumnHelper<any>();

export function ColumsTransactionFN(onOpen: () => void) {

  return [
    columnHelper.accessor("name", {
      header: () => (
        <div className="pl-6">
          <p>Name</p>
        </div>
      ),
      cell: (info) => (
        <div className="pl-6">
          <p className="font-medium text-sm">
            {info.row.original?.name} 
          </p>
          <p className="text-sm text-gray-500">
            {info.row.original?.email} 
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("brand", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Drugs Bought</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p className="font-medium text-sm">{info.row.original?.brand} </p>
        </div>
      ),
    }),
    columnHelper.accessor("quantity", {
      header: ({ column }) => (
        <p>Quantity</p>
      ),
      cell: (info) => (
       <div className="">
        <p>{info.row.original?.quantity}</p>
       </div>
      ),
    }),
    columnHelper.accessor("amount", {
        header: ({ column }) => (
          <p>Price</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p className="font-medium">{info?.row?.original?.amount}</p>
            </div>
          );
        },
    }),
    columnHelper.accessor("dateOfPurchase", {
        header: ({ column }) => (
          <p>Date of Purchase</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p className="font-medium">{info?.row?.original?.dateOfPurchase}</p>
            </div>
          );
        },
    }),
    columnHelper.accessor("paymentMethod", {
        header: ({ column }) => (
          <p>Payment Method</p>
        ),
        cell: (info) => {
          return (
            <div>
             <p className="font-medium">{info?.row?.original?.paymentMethod}</p>
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
            info?.row?.original?.status === "DEBIT" 
            ? "bg-[#FFFAEB] text-[#F79009]" 
            : info?.row?.original?.status === "Cancelled" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "CREDIT"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-gray-500", " max-w-min p-1 px-2 rounded-2xl text-sm"
            )}>
                <span className="w-3 h-3 rounded-full"></span>
                {" "}
               {formatText(info?.row?.original?.status)}
            </p>
          </div>
        );
      },
    })
  ];
}
