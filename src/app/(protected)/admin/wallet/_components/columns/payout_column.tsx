import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@/utils";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TransactionProps } from "@/types";
import { convertDate } from "@/utils/formatDate";

const columnHelper = createColumnHelper<TransactionProps>();

export function Payout_columnFn(
  walletType: "product_wallet" | "loan_wallet",
  onOpen: () => void,
  onOpenPayout: () => void
) {
  return [
    columnHelper.accessor("identifier", {
      header: ({ column }) => <p className="pl-6"> S/N</p>,
      cell: (info) => {
        const serialNumber = info?.row?.index + 1;
        return (
          <div className="pl-6">
            <p>{info.row.original.identifier}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("business", {
      header: ({ column }) => (
        <p className="pl-6">
          {walletType === "loan_wallet" ? "Vendor's Name" : "Supplier's Name"}
        </p>
      ),
      cell: (info) => {
        return (
          <div className="pl-6">
            <p>{info?.row?.original?.business?.name}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("type", {
      header: ({ column }) => <p className="">Transaction Type</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium capitalize">{info.row.original?.type}</p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => <p className="">Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">₦{info.row.original?.amount}</p>
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => <p className="">Date</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {convertDate(info.row.original?.createdAt)}
          </p>
        </div>
      ),
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => <p className="text-center">Actions</p>,
      cell: (info) => {
        return (
          <Flex justify={"center"}>
            <Menu>
              <MenuButton>
                <BsThreeDotsVertical className="w-5 h-auto" />
              </MenuButton>
              <MenuList>
                {info?.row?.original?.status === "Pending" ? (
                  <>
                    <MenuItem onClick={() => {}}>
                      Mark Transaction As Completed
                    </MenuItem>
                    <MenuItem onClick={onOpenPayout}>Initiate Payout</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => onOpen()}>
                      View Transaction Details
                    </MenuItem>
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
