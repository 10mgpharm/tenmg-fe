import { ApiLogData } from "@/types";
import { classNames } from "@/utils";
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
          <p className={classNames(
            (info?.row?.original?.status === "Failed")
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "Successful"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : info.row.original?.status === "Completed"
            ? "bg-blue-50 text-blue-500"
            : "text-gray-500", " max-w-min p-0.5 px-2 rounded-2xl capitalize text-sm font-medium"
            )}
          >
            {info.row.original?.status}
          </p>
          {/* <p className="text-gray-500"></p> */}
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
          <p>Timestamp</p>
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
