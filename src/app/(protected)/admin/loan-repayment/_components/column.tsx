import { classNames } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumsRepaymentFN(onOpen: () => void) {
  return [
    columnHelper.accessor("loan.identifier", {
      header: () => (
        <div className="pl-6">
          <p>Repayment ID</p>
        </div>
      ),
      cell: (info) => (
        <div
          onClick={() => {
            onOpen();
          }}
        >
          <p className="pl-6">{info.row.original?.identifier}</p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => <p>Repayment Amount</p>,
      cell: (info) => (
        <div className="">
          <p>{info.row.original?.amount}</p>
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: ({ column }) => <p>Due Date</p>,
      cell: (info) => {
        return (
          <div>
            <p>{info?.row?.original?.date}</p>
            <p className="text-gray-500">{info?.row?.original?.time}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("paymentStatus", {
      header: ({ column }) => <p>Repayment Status</p>,
      cell: (info) => {
        return (
          <div className="flex">
            <p
              className={classNames(
                info?.row?.original?.status === "Overdue"
                  ? "bg-[#FFFAEB] text-[#F79009]"
                  : info?.row?.original?.status === "Paid"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : "text-gray-500",
                " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
              )}
            >
              <span className="rounded-full text-[1.2rem]">•</span>{" "}
              {info?.row?.original?.paymentStatus}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("vendor", {
      header: ({ column }) => <p>Payment Date</p>,
      cell: (info) => (
        <div className="">
          <p>{info.row.original?.payment_date}</p>
        </div>
      ),
    }),
    columnHelper.accessor("vendor", {
      header: ({ column }) => <p>Loan Amount</p>,
      cell: (info) => (
        <div className="">
          <p>{info.row.original?.loan_amount}</p>
        </div>
      ),
    }),
  ];
}
