import { createColumnHelper } from "@tanstack/react-table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { classNames } from "@/utils";

const columnHelper = createColumnHelper<any>();

export function ColumsFN(onOpen: () => void) {

  return [
    columnHelper.accessor("createdAt", {
      header: () => (
        <div className="pl-6">
          <p>ID</p>
        </div>
      ),
      cell: (info) => (
        <div
          onClick={() => {
            onOpen();
          }}
        >
          <p className="pl-6">
            {info.row.original?.id} 
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //   mx="30px"
        >
          <p>Customer</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p>{info.row.original?.customer} </p>
            <p>{info.row.original?.phone} </p>
        </div>
      ),
    }),
    columnHelper.accessor("products", {
      header: ({ column }) => (
        <p>Date</p>
      ),
      cell: (info) => (
       <div className="">
        <p>{info.row.original?.date}</p>
       </div>
      ),
    }),
    columnHelper.accessor("isPublic", {
      header: ({ column }) => (
        <p>Status</p>
      ),
      cell: (info) => {
        return (
          <div>
           <p className={classNames(
            info?.row?.original?.status === "Pending" 
            ? "bg-[#FFFAEB] text-[#F79009]" 
            : info?.row?.original?.status === "Cancelled" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "Completed"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-gray-500", " max-w-min p-1 px-2 rounded-2xl text-sm"
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
        <p>Total</p>
      ),
      cell: (info) => {
        return (
          <div >
           <p>{info?.row?.original?.total}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Delivery Address</p>
      ),
      cell: (info) => {
        return (
          <div >
           <p>{info?.row?.original?.address}</p>
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
                    <MenuItem>View Order</MenuItem>
                    <MenuItem color={"red.500"}>Delete Order</MenuItem>
                </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
