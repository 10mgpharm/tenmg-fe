import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumnsFN() {
  return [
    columnHelper.accessor("identifier", {
      header: () => (
        <div className="pl-6">
          <p>Reference</p>
        </div>
      ),
      cell: (info) => (
        <div className="pl-6">
          <p>JRTOO3</p>
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: () => (
        <div>
          <p>Description</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-bold">Hydrochloride</p>
        </div>
      ),
    }),
    columnHelper.accessor("source", {
      header: () => <p>Amount</p>,
      cell: (info) => (
        <div>
          <p>₦15,161,060</p>
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: () => <p>Date</p>,
      cell: (info) => (
        <div>
          <p>5/12/2024</p>
        </div>
      ),
    }),
  ];
}
