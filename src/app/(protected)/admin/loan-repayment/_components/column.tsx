import { classNames } from "@/utils";
import { convertDate, convertDateWithTime } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumsRepaymentFN(
  onOpen: () => void,
  pageIndex: number,
  pageSize?: number
) {
  return [
    columnHelper.accessor("id", {
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
      header: ({ column }) => <p className="pl-6">Customer Name</p>,
      cell: (info) => {
        return (
          <div className="pl-6">
            <p>{info.row.original?.loan?.customer.name}</p>
          </div>
        );
      },
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

    columnHelper.accessor("updatedAt", {
      header: ({ column }) => <p>Payment Date</p>,
      cell: (info) => (
        <div className="">
          <p>{convertDate(info.row.original?.updatedAt)}</p>
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => <p>Created at</p>,
      cell: (info) => (
        <div className="">
          <p>{convertDate(info.row.original?.createdAt)}</p>
        </div>
      ),
    }),
  ];
}
