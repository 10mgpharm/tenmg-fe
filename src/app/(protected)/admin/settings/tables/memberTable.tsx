import { classNames } from "@/utils";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";

const columnHelper = createColumnHelper<any>();

export function ColumsMemberFN(
  onOpen: () => void,
  handleDeleteModal: (id: number) => void,
  handleOpenModal: (id: number, action: any) => void
) {
  return [
    columnHelper.accessor("email", {
      header: () => (
        <div className="pl-6">
          <p>Email Address</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="pl-6">{info.row.original?.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor("user", {
      header: ({ column }) => <p>Status</p>,
      cell: (info) => (
        <div>
          <p
            className={classNames(
              info?.row?.original?.active === 0
                ? "bg-[#FEF3F2] text-[#B42318]"
                : info?.row?.original?.active === 1
                ? "text-[#027A48] bg-[#ECFDF3]"
                : info?.row?.original?.active === "Invited"
                ? "text-blue-500 bg-blue-50"
                : "text-gray-500",
              " max-w-min p-0.5 px-3 rounded-2xl text-sm"
            )}
          >
            {info?.row?.original?.active === 1
              ? "Active"
              : info?.row.original.active === 0
              ? "Suspended"
              : "Invited"}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Name</p>
        </div>
      ),
      cell: (info) => (
        <div>
          <p>{info.row.original?.name} </p>
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: ({ column }) => <p>Date Invited</p>,
      cell: (info) => (
        <div>
          <p>{info.row.original?.date}</p>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: ({ column }) => <p>Role</p>,
      cell: (info) => {
        return (
          <div>
            <p className="capitalize">{info.row.original?.role}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <p>Actions</p>,
      cell: (info) => {
        return (
          <Flex justify={"center"}>
            <Menu>
              <MenuButton>
                <BsThreeDotsVertical className="w-5 h-auto" />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link href={"/admin/settings/member"}>View Details</Link>
                </MenuItem>
                <MenuItem>Suspend Member</MenuItem>
                <MenuItem onClick={() => handleDeleteModal(info.row.original?.id)} color="red.500">
                  Remove Member
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
