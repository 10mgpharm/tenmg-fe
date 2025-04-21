import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { classNames } from "@/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import { convertDate } from "@/utils/formatDate";
import { AdminMemers } from "@/types";
import { ActionType } from "@/constants";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper<AdminMemers>();
export function ColumsLenderFN(
  handleDeleteModal: (id: number) => void,
  pageIndex: number,
  pageSize: number,
  handleView: (id: number) => void,
  handleOpenModal: (id: number, action: ActionType) => void,
  userType?: "SUPPLIERS" | "VENDOR" | "PHARMACIES" | "LENDERS"
) {
  const route = useRouter();

  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>S/N</p>
        </div>
      ),
      cell: (info) => {
        const serialNumber =
          pageIndex > 1
            ? (pageIndex - 1) * pageSize + info?.row.index + 1
            : info?.row.index + 1;
        return (
          <div className="pl-6">
            <p className="font-medium">{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => <p>Name</p>,
      cell: (info) => {
        return (
          <div>
            <p className="font-medium">{info?.row?.original?.name}</p>
            <p>{info?.row?.original?.email}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("businessName", {
      header: ({ column }) => <p className="">Business Name</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">{info?.row?.original?.businessName}</p>
        </div>
      ),
    }),
    columnHelper.accessor("dateJoined", {
      header: ({ column }) => <p className="">Date Joined</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {convertDate(info?.row?.original?.dateJoined)}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <p>Status</p>,
      cell: (info) => {
        return (
          <div>
            <p
              className={classNames(
                info?.row?.original?.status === 2
                  ? "bg-[#FEF3F2] text-[#B42318]"
                  : info?.row?.original?.status === 1
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : "text-yellow-500 bg-yellow-50",
                " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
              )}
            >
              {"• "}
              {info?.row?.original?.status === 1
                ? "Active"
                : info?.row?.original?.status === 2
                ? "Invited"
                : "Suspended"}
            </p>
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
                <MenuItem onClick={() => handleView(info?.row?.original?.id)}>
                  View User
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    userType === "SUPPLIERS"
                      ? route.push(
                          `/admin/users/supplier-wallet/${info?.row?.original?.id}`
                        )
                      : userType === "LENDERS"
                      ? route.push(
                          `/admin/users/lender-wallet/${info?.row?.original?.id}`
                        )
                      : userType === "VENDOR"
                      ? route.push(
                          `/admin/users/vendor-wallet/${info?.row?.original?.id}`
                        )
                      : null
                  }
                >
                  View Wallet
                </MenuItem>
                {info?.row?.original?.status === 0 ? (
                  <MenuItem
                    onClick={() =>
                      handleOpenModal(
                        info?.row?.original?.id,
                        ActionType.ACTIVE
                      )
                    }
                  >
                    Unsuspend User
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() =>
                      handleOpenModal(
                        info?.row?.original?.id,
                        ActionType.SUSPENDED
                      )
                    }
                  >
                    Suspend User
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => handleDeleteModal(info?.row?.original?.id)}
                  color="red.500"
                >
                  Delete User
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
