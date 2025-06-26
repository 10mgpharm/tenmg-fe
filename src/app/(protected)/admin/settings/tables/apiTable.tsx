import { classNames } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
const columnHelper = createColumnHelper<any>();

export function ColumsAPIFN(revokeApi: (id: string, environment: "test" | "live") => void) {
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
        return (
          <Flex justify={"flex-start"}>
            <Menu placement="bottom-start">
              <MenuButton>
                <BsThreeDotsVertical className="" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => revokeApi(info.row.original.id, "test")} className="font-semibold">
                  Revoke Test Key
                </MenuItem>
                <MenuItem onClick={() => revokeApi(info.row.original.id, "live")} className="font-semibold">
                  Revoke Live Key
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
