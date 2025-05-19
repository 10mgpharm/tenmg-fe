import { ApiLogData } from "@/types";
import { classNames } from "@/utils";
import { convertDateWithTime } from "@/utils/formatDate";
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
          <p
            className={classNames(
              info?.row?.original?.status === "failed"
                ? "bg-[#FEF3F2] text-[#B42318]"
                : info?.row?.original?.status === "successful"
                ? "text-[#027A48] bg-[#ECFDF3]"
                : info.row.original?.status === "completed"
                ? "bg-blue-50 text-blue-500"
                : "text-gray-500",
              " max-w-min p-0.5 px-2 rounded-2xl capitalize text-sm font-medium"
            )}
          >
            <span className="rounded-full text-[1.2rem]">•</span>{" "}
            {info.row.original?.status}
          </p>
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
    columnHelper.accessor("route", {
      header: () => (
        <div>
          <p>Endpoint</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">{info.row.original?.route} </p>
        </div>
      ),
    }),
    columnHelper.accessor("response", {
      header: () => (
        <div>
          <p>Service Response</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium ">{info.row.original?.response} </p>
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: () => (
        <div>
          <p>Created At</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-medium">
            {convertDateWithTime(info.row.original?.createdAt)}
          </p>
        </div>
      ),
    }),
  ];
}
