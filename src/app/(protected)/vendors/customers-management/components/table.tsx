import { classNames } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export function ColumnsCustomerFN() {
  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>Reference ID</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">{info.row.original?.id}</p>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div>
          <p>Customer Name</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="font-bold">{info.row.original?.name} </p>
        </div>
      ),
    }),

    // Contact Information

    columnHelper.accessor("information", {
      header: ({ column }) => <p>Contact Information</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.email}</p>
        </div>
      ),
    }),

    // Date Created

    columnHelper.accessor("date", {
      header: ({ column }) => <p>Date Created</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.dateCreated}</p>
        </div>
      ),
    }),

    // Status
    columnHelper.accessor("status", {
      header: ({ column }) => <p>Account Status</p>,
      cell: (info) => (
        <div>
          <p  className={classNames(
               info?.row?.original?.status === "Active"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : info?.row?.original?.status === "Suspended"
                  ? "bg-[#FEF3F2] text-[#B42318]"
                  : "text-gray-500",
                " max-w-min p-1 px-2 rounded-2xl text-xs font-medium items-center justify-center flex gap-1"
              )}> <span className="rounded-full text-[1.2rem]">•</span>{info.row.original?.status}</p>
        </div>
      ),
    }),

    // Actions

    columnHelper.accessor("action", {
      header: ({ column }) => <p>Actions</p>,
      cell: (info) => {
        return (
          <div className="flex gap-4">
            <p className="text-primary font-medium">View</p>
            <p className="">Suspend</p>
          </div>
        );
      },
    }),
  ];
}
