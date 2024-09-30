import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { classNames } from "@/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();

export function ColumsUserFN(onOpen: () => void, onOpenDeactivate: () => void) {

  return [
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <p>Name</p>
      ),
      cell: (info) => {
        return (
          <div>
           <p>{info?.row?.original?.name}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("supplier_id", {
      header: ({ column }) => (
        <p className="">Transaction Type</p>
      ),
      cell: (info) => (
       <div className="">
        <p className="font-medium">{info.row.original?.type}</p>
       </div>
      ),
    }),
    columnHelper.accessor("weight", {
      header: ({ column }) => (
        <p className="">Amount</p>
      ),
      cell: (info) => (
       <div className="">
        <p className="font-medium">{info.row.original?.amount}</p>
       </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: ({ column }) => (
        <p className="">Date</p>
      ),
      cell: (info) => (
       <div className="">
        <p className="font-medium">{info.row.original?.date}</p>
       </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Status</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className={classNames(
            info?.row?.original?.status === "Failed" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "Completed"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-yellow-500 bg-yellow-50", " max-w-min p-1 px-2 rounded-2xl text-sm"
            )}>
                <span className="w-3 h-3 rounded-full"></span>
                {" "}
               {info?.row?.original?.status}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Actions</p>
      ),
      cell: (info) => {
        return (
        <Flex justify={"center"}>
            <Menu>
                <MenuButton>
                    <BsThreeDotsVertical className="w-5 h-auto"/>
                </MenuButton>
                <MenuList>
                    <MenuItem>
                        <Link href={`/admin/users/${info?.row?.original?.name}`}>View User</Link>
                    </MenuItem>
                    <MenuItem>Login as user</MenuItem>
                    {
                      info?.row?.original?.status === "Suspended" ? 
                      <MenuItem onClick={() => onOpenDeactivate()}>Unsuspend User</MenuItem>
                      : info?.row?.original?.status === "Active" ?
                      <MenuItem onClick={() => onOpenDeactivate()}>Suspend User</MenuItem>
                      :
                        <>
                        <MenuItem onClick={() => onOpenDeactivate()}>Approve</MenuItem>
                        <MenuItem onClick={() => onOpenDeactivate()}>Disapprove</MenuItem>
                        </>
                    }
                    <MenuItem onClick={() => onOpen()} color="red.500">Delete</MenuItem>
                </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
