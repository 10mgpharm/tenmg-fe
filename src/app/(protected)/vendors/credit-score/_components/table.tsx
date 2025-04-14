import { CreditScoreData } from "@/types";
import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<CreditScoreData>();

export function ColumnsCreditScoreFN() {
  return [
    columnHelper.accessor("identifier", {
      header: () => (
        <div className="pl-6">
          <p>Reference ID</p>
        </div>
      ),
      cell: (info) => (
        <div className="pl-6">
          <p>{info.row.original?.identifier}</p>
          <p>{info.row.original?.createdAt}</p>
        </div>
      ),
    }),
    columnHelper.accessor("customer.name", {
      header: () => (
        <div>
          <p>Customer</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-bold">{info.row.original?.customer?.name} </p>
          <p>{info.row.original?.customer?.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor("customer.name", {
      header: () => (
        <div>
          <p>Category</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-semibold">Category A</p>
        </div>
      ),
    }),
    columnHelper.accessor("creditScoreResult.scoreTotal", {
      header: () => <p>Credit Score</p>,
      cell: (info) => (
        <div>
          <p>
            {info.row.original?.creditScoreResult?.scoreValue} /{" "}
            {info.row.original.creditScoreResult.scoreTotal}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("creditScoreResult.scorePercent", {
      header: () => <p>Percentage</p>,
      cell: (info) => (
        <div>
          <p>
            {`${Number(
              info.row.original?.creditScoreResult?.scorePercent.toPrecision(2)
            )}%`}
          </p>
        </div>
      ),
    }),

    columnHelper.accessor("id", {
      header: () => <p>Action</p>,
      cell: (info) => {
        return (
          <div className="flex gap-4">
            <Link
              href={`/vendors/transactions-history/${info.row.original?.customer?.lastEvaluationHistory?.id}`}
              className="text-primary font-medium"
            >
              View
            </Link>
          </div>
        );
      },
    }),
  ];
}
