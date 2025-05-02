import Link from "next/link";
import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumnsLoanRepaymentFN() {
  return [
    columnHelper.accessor("name", {
      header: ({ column }) => <p className="pl-6"> S/N</p>,
      cell: (info) => {
        const serialNumber = info?.row?.index + 1;
        return (
          <div className="pl-6">
            <p>{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("loan.customer.name", {
      header: () => (
        <div>
          <p>Customer Name</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-bold">{info.row.original?.loan.customer.name} </p>
        </div>
      ),
    }),
    columnHelper.accessor("loan.capitalAmount", {
      header: () => <p>Loan Amount</p>,
      cell: (info) => (
        <div>
          <p className=" font-medium">
            ₦{info.row.original?.loan.capitalAmount}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("totalAmount", {
      header: () => <p>Repayment Amount</p>,
      cell: (info) => (
        <div>
          <p className="pl-6 font-medium">₦{info.row.original?.totalAmount}</p>
        </div>
      ),
    }),
    columnHelper.accessor("dueDate", {
      header: () => <p>Due Date</p>,
      cell: (info) => (
        <div>
          <p>{convertDate(info.row.original?.dueDate || null)}</p>
        </div>
      ),
    }),
    // Status
    columnHelper.accessor("paymentStatus", {
      header: () => <p>Payment Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.paymentStatus === "PAID"
                ? "text-[#027A48] bg-[#ECFDF3]"
                : "bg-[#FFFAEB] text-[#F79009]",
              " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
            )}
          >
            <span className="rounded-full text-[1.2rem]">•</span>{" "}
            {info.row.original?.paymentStatus}
          </p>
        </div>
      ),
    }),
    // columnHelper.accessor("id", {
    //   header: () => <p>Action</p>,
    //   cell: (info) => {
    //     return (
    //       <div className="flex gap-4">
    //         <Link
    //           href={`/vendors/loan-repayments/${info.row.original?.loanId}`}
    //           className="text-primary font-medium"
    //         >
    //           View
    //         </Link>
    //       </div>
    //     );
    //   },
    // }),
  ];
}
