import { classNames } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumsAPIFN(revokeApi: (id: string) => void) {
  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>S/N</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">{info.row.original?.id}</p>
        </div>
      ),
    }),
    columnHelper.accessor("vendors", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>List of vendors</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p>{info.row.original?.vendors} </p>
        </div>
      ),
    }),
    columnHelper.accessor("user", {
      header: ({ column }) => <p>Reference ID</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.reference_id}</p>
        </div>
      ),
    }),
    columnHelper.accessor("user", {
      header: ({ column }) => <p>Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.status === "Test"
                ? "bg-[#FEF3F2] text-[#B42318]"
                : info?.row?.original?.status === "Live"
                ? "text-[#027A48] bg-[#ECFDF3]"
                : "text-gray-500",
              " max-w-min p-0.5 px-3 rounded-2xl text-sm"
            )}
          >
            {info?.row?.original?.status}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("action", {
      header: ({ column }) => <p>Actions</p>,
      cell: (info) => {
        return (
          <div>
            <p
              onClick={() => {
                revokeApi("");
              }}
              className="text-red-500 cursor-pointer font-medium"
            >
              {"Revoke API Keys"}
            </p>
          </div>
        );
      },
    }),
  ];
}
