import { formatAmount } from "@/utils/formatAmount";
import { createColumnHelper } from "@tanstack/react-table";

type TransactionData = {
  reference: string;
  description: string;
  amount: string | number;
  date: string;
};

const columnHelper = createColumnHelper<TransactionData>();

export function ColumnsFN() {
  return [
    columnHelper.accessor("reference", {
      header: () => (
        <div className="pl-6">
          <p>Reference</p>
        </div>
      ),
      cell: (info) => (
        <div className="pl-6">
          <p>{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: () => (
        <div>
          <p>Description</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-bold">{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: () => <p>Amount</p>,
      cell: (info) => (
        <div>
          <p>{formatAmount(info.getValue())}</p>
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: () => <p>Date</p>,
      cell: (info) => (
        <div>
          <p>{info.getValue()}</p>
        </div>
      ),
    }),
  ];
}
