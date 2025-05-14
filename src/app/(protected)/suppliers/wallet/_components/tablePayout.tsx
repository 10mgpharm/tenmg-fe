import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@/utils";
import { PayoutTypeProps } from "@/types";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dispatch, SetStateAction } from "react";

const columnHelper = createColumnHelper<PayoutTypeProps>();

export function ColumsPayoutFN(
  onOpen: () => void,
  setSelectedRow: Dispatch<SetStateAction<PayoutTypeProps | null>>,
) {
  return [
    columnHelper.accessor("createdAt", {
      header: ({ column }) => <p className="pl-6">Date</p>,
      cell: (info) => (
        <div className="pl-6">
          <p className="font-medium">
            {info.row.original?.createdAt}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => <p className="">OrderID</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {info.row.original?.order?.identifier}
          </p>
        </div>
      ),
    }),
    // columnHelper.accessor("tenmgCommission", {
    //   header: ({ column }) => <p className="">Commission</p>,
    //   cell: (info) => (
    //     <div className="">
    //       <p className="font-medium">
    //       ₦{info.row.original?.tenmgCommission ?? `0.00`}
    //       </p>
    //     </div>
    //   ),
    // }),
    columnHelper.accessor("actualPrice", {
      header: ({ column }) => <p className="">Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">₦{info.row.original?.actualPrice}</p>
          <span className="text-xs text-red-500">
            Commission: ₦{info.row.original?.tenmgCommission ?? "0.00"}
          </span>
        </div>
      ),
    }),
    // columnHelper.accessor("actualPrice", {
    //   header: ({ column }) => <p className="">Amount</p>,
    //   cell: (info) => (
    //     <div className="">
    //       <p className="font-medium">₦{info.row.original?.actualPrice}</p>
    //     </div>
    //   ),
    // }),
    columnHelper.accessor("status", {
        header: ({ column }) => <p>Status</p>,
        cell: (info) => {
          return (
            <div>
              <p
                className={classNames(
                  "text-green-500 bg-green-50 max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
                )}
              >
                <span className="rounded-full text-[1.2rem]">•</span>{" "}
                PAID
              </p>
            </div>
          );
        },
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => <p className="text-center">Actions</p>,
      cell: (info) => {
        return (
          <Flex justify={"center"}>
            <Menu>
                <MenuButton>
                    <BsThreeDotsVertical className="w-5 h-auto" />
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => {
                        setSelectedRow(info.row.original);
                        onOpen();
                        }}>
                      View Transaction Details
                    </MenuItem>
                </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
