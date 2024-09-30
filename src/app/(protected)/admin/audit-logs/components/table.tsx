import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumsLogFN() {
  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>Timestamp</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">
            {info.row.original?.timestamp} 
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("event", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Event</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p>{info.row.original?.event} </p>
        </div>
      ),
    }),
    columnHelper.accessor("user", {
      header: ({ column }) => (
        <p>User</p>
      ),
      cell: (info) => (
       <div>
        <p>{info.row.original?.user}</p>
       </div>
      ),
    }),
    columnHelper.accessor("action", {
      header: ({ column }) => (
        <p>Actions</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className="">{info?.row?.original?.action}</p>
          </div>
        );
      },
    }),
  ];
}
