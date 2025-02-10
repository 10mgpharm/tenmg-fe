import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { classNames, convertLetterCase } from "@/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();

export function ColumnsMemberFN(
  handleDeleteModal: (id: number) => void,
  handleOpenModal?: (userId: number, action: any) => void
) {
  return [
    columnHelper.accessor("name", {
      header: () => (
        <div className="">
          <p>Name</p>
        </div>
      ),
      cell: (info) => (
        <div className="flex items-center gap-2">
          <p className="font-medium">{info?.row?.original?.fullName}</p>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <p>Status</p>,
      cell: (info) => {
        const status = convertLetterCase(
          info?.row?.original?.status === "ACCEPTED" &&
            info?.row?.original?.user?.active === 1
            ? "Active"
            : info?.row?.original?.status === "ACCEPTED" &&
              info?.row?.original?.user?.active === 0
            ? "Suspended"
            : info?.row.original.status === "INVITED"
            ? "Invited"
            : "Active"
        );

        return (
          <div>
            <p
              className={classNames(
                info?.row?.original?.user?.active === 0
                  ? "bg-[#FEF3F2] text-[#B42318]"
                  : info?.row?.original?.status === "ACCEPTED"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : info?.row?.original?.status === "INVITED"
                  ? "text-blue-500 bg-blue-50"
                  : "text-gray-500",
                " max-w-min p-1 px-2 rounded-2xl text-xs font-medium"
              )}
            >
              {"• "}
              {status}
            </p>
          </div>
        );
      },
    }),

    columnHelper.accessor("roles", {
      header: ({ column }) => <p className="px-5">Role</p>,
      cell: (info) => (
        <div className="px-5">
          <p className="font-medium">
            {convertLetterCase(info.row.original?.role)}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => <p className="px-5">Email Address</p>,
      cell: (info) => (
        <div className="px-5">
          <p className="font-medium">{info.row.original?.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor("action", {
      header: ({ column }) => <p></p>,
      cell: (info) => {
        return (
          <Flex justify={"left"}>
            <Menu>
              <MenuButton>
                <BsThreeDotsVertical className="w-5 h-auto" />
              </MenuButton>
              <MenuList>
                {info?.row?.original?.status === "INVITED" ? (
                  <MenuItem
                    onClick={() => handleDeleteModal(info.row.original?.id)}
                    color="red.500"
                  >
                    Revoke Invite
                  </MenuItem>
                ) : (
                  <>
                    <Link
                      href={`/vendors/users/${info?.row?.original?.user?.id}`}
                    >
                      <MenuItem>View Details</MenuItem>
                    </Link>
                    {info?.row?.original?.user?.active === 0 ? (
                      <MenuItem
                        onClick={() =>
                          handleOpenModal(info.row.original?.user?.id, "ACTIVE")
                        }
                      >
                        Activate Member
                      </MenuItem>
                    ) : (
                      <MenuItem
                        color="red.500"
                        onClick={() =>
                          handleOpenModal(
                            info.row.original?.user?.id,
                            "SUSPENDED"
                          )
                        }
                      >
                        Suspend Member
                      </MenuItem>
                    )}{" "}
                  </>
                )}
              </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
