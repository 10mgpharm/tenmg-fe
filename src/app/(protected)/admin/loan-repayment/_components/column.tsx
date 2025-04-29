import { classNames } from "@/utils";
import { convertDate, convertDateWithTime } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumsRepaymentFN(onOpen: () => void) {
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
    columnHelper.accessor("totalAmount", {
      header: ({ column }) => <p>Repayment Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">₦{info.row.original?.totalAmount}</p>
        </div>
      ),
    }),
    columnHelper.accessor("dueDate", {
      header: ({ column }) => <p>Due Date</p>,
      cell: (info) => {
        return (
          <div>
            <p>{convertDateWithTime(info?.row?.original?.dueDate)}</p>
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
                info?.row?.original?.paymentStatus === "PAID"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : "bg-[#FFFAEB] text-[#F79009]",
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
    columnHelper.accessor("updatedAt", {
      header: ({ column }) => <p>Payment Date</p>,
      cell: (info) => (
        <div className="">
          <p>{convertDate(info.row.original?.updatedAt)}</p>
        </div>
      ),
    }),
    columnHelper.accessor("loan.capitalAmount", {
      header: ({ column }) => <p>Loan Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            ₦{info.row.original?.loan.capitalAmount}
          </p>
        </div>
      ),
    }),
  ];
}
