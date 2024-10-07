import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

const columnHelper = createColumnHelper<any>();

export function ColumsFN(onOpen: () => void, onOpenPayout: () => void) {

  return [
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <p className="pl-2">Supplier Name</p>
      ),
      cell: (info) => {
        return (
          <div className="pl-2">
           <p>{info?.row?.original?.name}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <p className="">Amount</p>
      ),
      cell: (info) => (
       <div className="">
        <p className="font-medium">{info.row.original?.amount}</p>
       </div>
      ),
    }),
    columnHelper.accessor("weight", {
      header: ({ column }) => (
        <p className="">Date Due</p>
      ),
      cell: (info) => (
       <div className="">
        <p className="font-medium">{info.row.original?.date}</p>
       </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p className="text-center">Actions</p>
      ),
      cell: (info) => {
        return (
        <Flex justify={"center"}>
            <Menu>
                <MenuButton>
                    <BsThreeDotsVertical className="w-5 h-auto"/>
                </MenuButton>
                <MenuList>
                    {
                      info?.row?.original?.status === "Pending" ? 
                      <>
                      <MenuItem onClick={() => {}}>Mark transaction as completed</MenuItem>
                      <MenuItem onClick={() => onOpenPayout()}>Initiate Payout</MenuItem>
                      </>
                      :
                      <>
                      <MenuItem onClick={() => onOpen()}>View transaction details</MenuItem>
                    </>
                    }
                </MenuList>
            </Menu>
          </Flex>
        )
      },
    }),
  ];
}
