import { RepaymentSchedule } from "@/types";
import { classNames } from "@/utils";
import { convertDate, getFormattedTime } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<RepaymentSchedule>();

export function ColumnsRepaymentFN(onOpen: () => void) {
  return [
    columnHelper.accessor("id", {
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
          <p className="pl-6">{info.row.original?.id}</p>
        </div>
      ),
    }),
    columnHelper.accessor("balance", {
      header: ({ column }) => <p>Repayment Amount</p>,
      cell: (info) => (
        <div className="">
          <p>{info.row.original?.balance}</p>
        </div>
      ),
    }),
    columnHelper.accessor("dueDate", {
      header: ({ column }) => <p>Due Date</p>,
      cell: (info) => {
        const dueDate = info?.row?.original?.dueDate;
        return (
          <div>
            <p>{dueDate && convertDate(dueDate)}</p>
            <p className="text-gray-500">{getFormattedTime(dueDate)}</p>
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
                info?.row?.original?.paymentStatus === "PENDING"
                  ? "bg-[#FFFAEB] text-[#F79009]"
                  : info?.row?.original?.paymentStatus === "OVERDUE"
                  ? "bg-[#FEF3F2] text-[#C62828]"
                  : info?.row?.original?.paymentStatus === "PAID"
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
    columnHelper.accessor("dueDate", {
      header: ({ column }) => <p>Payment Date</p>,
      cell: (info) => {
        const paymentDate = info?.row?.original?.updatedAt;
        return (
          <div>
            <p>{paymentDate && convertDate(paymentDate)}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("totalAmount", {
      header: ({ column }) => <p>Loan Amount</p>,
      cell: (info) => (
        <div className="">
          <p>{info.row.original?.totalAmount}</p>
        </div>
      ),
    }),
  ];
}
