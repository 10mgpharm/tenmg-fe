import { ApiLogData } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<ApiLogData>();

export function ColumnsApiLogFN() {
  return [
    columnHelper.accessor("status", {
      header: () => (
        <div className="pl-6">
          <p>Status</p>
        </div>
      ),
      cell: (info) => (
        <div className="pl-6">
          <p className="text-gray-500">{info.row.original?.status}</p>
        </div>
      ),
    }),
    columnHelper.accessor("event", {
      header: () => (
        <div>
          <p>Event</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.row.original?.event} </p>
        </div>
      ),
    }),
    columnHelper.accessor("endpoint", {
        header: () => (
          <div>
            <p>Endpoint</p>
          </div>
        ),
        cell: (info) => (
          <div>
            <p className="font-medium">{info.row.original?.endpoint} </p>
          </div>
        ),
      }),
    columnHelper.accessor("server_response", {
        header: () => (
          <div>
            <p>Service Response</p>
          </div>
        ),
        cell: (info) => (
          <div>
            <p className="font-medium">{info.row.original?.server_response} </p>
          </div>
        ),
      }),
    columnHelper.accessor("timestamp", {
      header: () => (
        <div>
          <p>Action</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.row.original?.timestamp}</p>
        </div>
      ),
    }),
  ];
}
