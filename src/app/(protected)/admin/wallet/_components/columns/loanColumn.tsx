import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@/utils";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LoanTransactionProps } from "@/types";
import { Dispatch, SetStateAction } from "react";

const columnHelper = createColumnHelper<LoanTransactionProps>();

export function loanColumnFn(
  onOpen: () => void,
  setSelectedRow: Dispatch<SetStateAction<LoanTransactionProps>>
) {
  return [
    columnHelper.accessor("identifier", {
      header: ({ column }) => <p className="pl-6">Transaction ID</p>,
      cell: (info) => (
        <div className="pl-6">
          <p className="font-medium">
            {info.row.original?.identifier}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => <p className="">Description</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
          {info.row.original?.description}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("business", {
      header: ({ column }) => <p className="">Business</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {info.row.original?.business?.name}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => <p className="">Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">₦{Number(info.row.original?.amount)?.toLocaleString() ?? `0.00`}</p>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <p>Type</p>,
      cell: (info) => {
        return (
          <div>
            <p
              className={classNames(
                info?.row?.original?.type === "DEBIT"
                  ? "bg-[#FEF3F2] text-[#B42318]"
                  : info?.row?.original?.type === "CREDIT"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : "text-orange-500 bg-orange-50",
                " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
              )}
            >
              <span className="rounded-full text-[1.2rem]">•</span>{" "}
              {info?.row?.original?.type}
            </p>
          </div>
        );
      },
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
