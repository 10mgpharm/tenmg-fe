import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { classNames } from "@/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import { convertDate } from "@/utils/formatDate";
import { AdminApprovals } from "@/types";

const columnHelper = createColumnHelper<AdminApprovals>();
export function ColumnsSupplierFN(
  handleView: (id: number) => void,
  handleAcceptRequest: (id: number) => void,
  handleDecline: (id: number) => void
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
        <div className="">
          <p className="font-medium">{info?.row?.original?.type || "N/A"}</p>
        </div>
      ),
    }),
    columnHelper.accessor("licenseNumber", {
      header: ({ column }) => <p className="">License Number</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {info?.row?.original?.licenseNumber || "N/A"}
          </p>
        </div>
      ),
    }),

    columnHelper.accessor("expiryDate", {
      header: ({ column }) => <p className="">Expiry Date</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">{info?.row?.original?.expiryDate}</p>
        </div>
      ),
    }),

    columnHelper.accessor("createdAt", {
      header: ({ column }) => <p className="">Date Submitted</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">{info?.row?.original?.createdAt}</p>
        </div>
      ),
    }),

    columnHelper.accessor("actions", {
      header: ({ column }) => <p>Actions</p>,
      cell: (info) => {
        return (
          <Menu>
            <MenuButton>
              <BsThreeDotsVertical className="w-5 h-auto" />
            </MenuButton>
            <MenuList>
              <MenuItem
                mb={2}
                onClick={() => handleView(info?.row?.original?.id)}
              >
                View Request
              </MenuItem>
              <MenuItem
                mb={2}
                onClick={() => handleAcceptRequest(info?.row?.original?.id)}
              >
                Accept Request
              </MenuItem>
              <MenuItem
                onClick={() => handleDecline(info?.row?.original?.id)}
                color="red.500"
              >
                Decline Request
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
    }),
  ];
}
