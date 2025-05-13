import Link from "next/link";
import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumnsLoanRepaymentFN(pageIndex: number, pageSize?: number) {
  return [
    columnHelper.accessor("name", {
      header: ({ column }) => <p className="pl-6"> S/N</p>,
      cell: (info) => {
        !pageSize ? (pageSize = 10) : pageSize;
        const serialNumber =
          pageIndex > 1
            ? (pageIndex - 1) * pageSize + info?.row.index + 1
            : info?.row.index + 1;
        return (
          <div>
            <p className="pl-6">{serialNumber}</p>
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
    columnHelper.accessor("updatedAt", {
      header: ({ column }) => <p>Payment Date</p>,
      cell: (info) => (
        <div className="">
          <p>{convertDate(info.row.original?.updatedAt)}</p>
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => <p>Created At</p>,
      cell: (info) => (
        <div className="">
          <p>{convertDate(info.row.original?.createdAt)}</p>
        </div>
      ),
    }),
  ];
}
