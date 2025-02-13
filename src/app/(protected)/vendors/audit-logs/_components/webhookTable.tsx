import { AuditLogData } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<AuditLogData>();

export function ColumnsWebhookFN() {
  return [
    columnHelper.accessor("timestamp", {
      header: () => (
        <div className="pl-6">
          <p>Timestamp</p>
        </div>
      ),
      cell: (info) => (
        <div className="pl-6">
          <p className="text-gray-500">{info.row.original?.timestamp}</p>
        </div>
      ),
    }),
    columnHelper.accessor("user", {
      header: () => (
        <div>
          <p>User</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.row.original?.user} </p>
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
    columnHelper.accessor("action", {
      header: () => (
        <div>
          <p>Action</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.row.original?.action}</p>
        </div>
      ),
    }),
  ];
}
