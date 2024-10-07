
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumsActivityFN() {
  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>Event Type</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">
            {info.row.original?.type} 
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Description</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p>{info.row.original?.description} </p>
        </div>
      ),
    }),
    columnHelper.accessor("timestamp", {
      header: ({ column }) => (
        <p>Time Stamp</p>
      ),
      cell: (info) => (
       <div>
        <p>{info.row.original?.timestamp}</p>
       </div>
      ),
    }),
  ];
}
