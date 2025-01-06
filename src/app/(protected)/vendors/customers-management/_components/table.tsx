import { CustomerData } from "@/types";
import { classNames } from "@/utils";
import { convertDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<CustomerData>();

export function ColumnsCustomerFN(
  handleOpenModal: (id: number, action: "activate" | "suspend") => void
) {
  return [
    columnHelper.accessor("identifier", {
      header: () => (
        <div className="pl-6">
          <p>Reference ID</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">{info.row.original?.identifier}</p>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: () => (
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

    columnHelper.accessor("email", {
      header: () => <p>Contact Information</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.email}</p>
        </div>
      ),
    }),

    // Date Created

    columnHelper.accessor("createdAt", {
      header: () => <p>Date Created</p>,
      cell: (info) => (
        <div>
          <p>{convertDate(info.row.original?.createdAt || null)}</p>
        </div>
      ),
    }),

    // Status
    columnHelper.accessor("active", {
      header: () => <p>Account Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.active === 1
                ? "text-[#027A48] bg-[#ECFDF3]"
                : info?.row?.original?.active === 0
                ? "bg-[#FEF3F2] text-[#B42318]"
                : "text-gray-500",
              " max-w-min p-1 px-2 rounded-2xl text-xs font-medium items-center justify-center flex gap-1"
            )}
          >
            {" "}
            <span className="rounded-full text-[1.2rem]">•</span>
            {info.row.original?.active === 1 ? "Active" : "Suspended"}
          </p>
        </div>
      ),
    }),

    // Actions

    columnHelper.accessor("id", {
      header: () => <p>Actions</p>,
      cell: (info) => {
        return (
          <div className="flex gap-4">
            <Link
              href={`/vendors/customers-management/${info.row.original?.id}`}
              className="text-primary font-medium"
            >
              View
            </Link>
            <p
              className={classNames(
                info?.row?.original?.active === 1
                  ? "text-[#B42318] "
                  : info?.row?.original?.active === 0
                  ? "text-[#027A48]"
                  : "text-gray-500",
                "cursor-pointer"
              )}
              onClick={() =>
                handleOpenModal(
                  info.row.original?.id,
                  info.row.original?.active ? "suspend" : "activate"
                )
              }
            >
              {info.row.original?.active ? "Suspend" : "Activate"}
            </p>
          </div>
        );
      },
    }),
  ];
}
