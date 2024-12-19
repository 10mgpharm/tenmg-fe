import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { classNames } from "@/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import { convertDate } from "@/utils/formatDate";
import { AdminApprovals } from "@/types";

const columnHelper = createColumnHelper<AdminApprovals>();
export function ColumsSupplierFN(
  onOpen: () => void,
  onOpenDeactivate: () => void,
  pageIndex: number,
  pageSize: number
) {
  return [
    columnHelper.accessor("name", {
      header: ({ column }) => <p className="pl-4">Name</p>,
      cell: (info) => {
        return (
          <div>
            <p className="font-medium pl-4">
              {info?.row?.original?.businessName}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("type", {
      header: ({ column }) => <p className="">User Type</p>,
      cell: (info) => (
        <div className="pl-4">
          <p className="font-medium">{info?.row?.original?.type || "null"}</p>
        </div>
      ),
    }),
    columnHelper.accessor("licenseNumber", {
      header: ({ column }) => <p className="">License Number</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {convertDate(info?.row?.original?.licenseNumber)}
          </p>
        </div>
      ),
    }),

    columnHelper.accessor("createdAt", {
      header: ({ column }) => <p className="">Date Submitted</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {info?.row?.original?.createdAt
              ? convertDate(info?.row?.original?.createdAt)
              : "null"}
          </p>
        </div>
      ),
    }),

    columnHelper.accessor("createdAt", {
      header: ({ column }) => <p>Actions</p>,
      cell: (info) => {
        return (
          <Flex justify={"center"}>
            <Menu>
              <MenuButton>
                <BsThreeDotsVertical className="w-5 h-auto" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => onOpen()}>View Request</MenuItem>
                <MenuItem onClick={() => onOpen()}>Accept Request</MenuItem>
                <MenuItem onClick={() => onOpen()} color="red.500">
                  Delete Request
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
