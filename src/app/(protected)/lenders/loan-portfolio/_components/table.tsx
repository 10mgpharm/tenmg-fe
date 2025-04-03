import { ApplicationDto, LoanData } from "@/types";
import { classNames } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<LoanData>();

export function ColumnsLoanApplicationFN() {
  return [
    columnHelper.accessor("id", {
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

    columnHelper.accessor("identifier", {
      header: () => (
        <div className="pl-6">
          <p>Loan ID</p>
        </div>
      ),
      cell: (info) => (
        <div className="flex flex-col gap-2 pl-6  justify-start">
          <p className="text-gray-500">{info.row.original?.identifier}</p>
        </div>
      ),
    }),

    columnHelper.accessor("customer", {
      header: () => (
        <div className="pl-6">
          <p>Customer</p>
        </div>
      ),
      cell: (info) => (
        <div className="flex flex-col gap-2 pl-6  justify-start">
          <p className="text-gray-500">{info.row.original?.customer?.name}</p>
          <span className="text-gray-700 text-xs">
            {info.row.original?.customer?.email}
          </span>
        </div>
      ),
    }),

    columnHelper.accessor("totalAmount", {
      header: ({ column }) => <p>Total Loan Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {formatAmount(info.row.original?.totalAmount)}
          </p>
        </div>
      ),
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => <p>Status</p>,
      cell: (info) => {
        return (
          <div>
            <p
              className={classNames(
                info.row.original.status === "DISBURSED"
                  ? "bg-[#FEF3F2] text-[#B42318]"
                  : info?.row?.original?.status === "DISBURSED"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : info.row.original?.status === "INITIATED"
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-500",
                " max-w-min p-0.5 px-2 rounded-2xl text-sm capitalize font-medium"
              )}
            >
              <span className="text-[1.2rem] rounded-full">•</span>{" "}
              {info.row.original?.status}
            </p>
          </div>
        );
      },
    }),

    columnHelper.accessor("repaymentSchedule", {
      header: ({ column }) => <p>Amount Left</p>,
      cell: (info) => {
        const repaymentSchedule = info?.row?.original?.repaymentSchedule;
        const isValidSchedule =
          repaymentSchedule && Array.isArray(repaymentSchedule);
        const isEmptySchedule =
          isValidSchedule && repaymentSchedule.length === 0;

        if (!isValidSchedule || isEmptySchedule) {
          return (
            <div>
              <p className="font-medium">₦0.00</p>
            </div>
          );
        }

        const totalPendingAmount = repaymentSchedule
          .filter((payment) => payment.paymentStatus === "PENDING")
          .reduce((sum, payment) => {
            const amount = parseFloat(payment.totalAmount) || 0;
            return sum + amount;
          }, 0);

        return (
          <div>
            <p className="font-medium">
              {formatAmount(totalPendingAmount.toString())}
            </p>
          </div>
        );
      },
    }),

    columnHelper.accessor("repaymentSchedule", {
      header: ({ column }) => <p>Next Payment</p>,
      cell: (info) => {
        const repaymentSchedule = info?.row?.original?.repaymentSchedule;
        const isValidSchedule =
          repaymentSchedule && Array.isArray(repaymentSchedule);
        const isEmptySchedule =
          isValidSchedule && repaymentSchedule.length === 0;

        if (!isValidSchedule || isEmptySchedule) {
          return (
            <div>
              <p className="text-gray-500">No payments scheduled</p>
            </div>
          );
        }

        const pendingPayments = repaymentSchedule
          .filter((payment) => payment.paymentStatus === "PENDING")
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );

        if (pendingPayments.length === 0) {
          return (
            <div>
              <p className="text-gray-500">All payments completed</p>
            </div>
          );
        }

        const nextPayment = pendingPayments[0];
        // const nextPaymentAmount = formatAmount(nextPayment.totalAmount);

        const dueDate = new Date(nextPayment.dueDate);
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(dueDate);

        return (
          <div>
            {/* <p className="font-medium">{nextPaymentAmount}</p> */}
            <div className="flex items-center gap-1">
              <span className="text-gray-600 text-sm">{formattedDate}</span>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("id", {
      header: ({ column }) => <p>Action</p>,
      cell: (info) => (
        <div className="flex items-center gap-3 px-2">
          <Link
            href={`/vendors/loan-applications/${info.row.original?.id}`}
            className="text-primary-600 font-medium cursor-pointer "
          >
            View
          </Link>
        </div>
      ),
    }),
  ];
}
