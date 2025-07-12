import { classNames } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { cn } from "@/lib/utils";
const columnHelper = createColumnHelper<any>();

export function ColumsAPIFN(
  revokeApi: (value: {
    businessId: number;
    secret: string;
    key: string;
  }) => void,
  setConfirmAction: (value: boolean) => void,
  pageNumber: number
) {
  return [
    columnHelper.accessor("id", {
      header: () => (
        <div>
          <p>S/N</p>
        </div>
      ),
      cell: (info) => {
        const serialNumber = (pageNumber - 1) * 10 + info?.row?.index + 1;
        return (
          <div>
            <p>{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("business.name", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Vendor&apos;s Name</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p>{info.row.original?.business?.name} </p>
        </div>
      ),
    }),

    columnHelper.accessor("action", {
      header: ({ column }) => <p>Action</p>,
      cell: (info) => {
        const key = info.row.original?.key;
        const secret = info.row.original?.secret;
        const businessId = info.row.original?.business?.id;
        return (
          <p
            className={cn(
              "text-red-500 text-[15px] font-semibold cursor-pointer",
              !key && !secret && "!text-red-500/50 cursor-not-allowed"
            )}
            onClick={() => {
              if (!key && !secret) return;
              setConfirmAction(true);
              revokeApi({
                key,
                secret,
                businessId,
              });
            }}
          >
            {!key && !secret ? "Revoked" : "Revoke"}
          </p>
        );
      },
    }),
  ];
}
