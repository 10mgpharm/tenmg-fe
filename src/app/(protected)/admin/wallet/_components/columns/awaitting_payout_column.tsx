import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@/utils";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Daum2} from "@/types";

const columnHelper = createColumnHelper<Daum2>();

export function Awaiting_columnFn(
  onOpen: () => void,
  onOpenPayout: () => void
) {
  return [
    columnHelper.accessor("txnGroup", {
      header: ({ column }) => <p className="pl-6">Date</p>,
      cell: (info) => (
        <div className="pl-6">
          <p className="font-medium">
            {info.row.original?.createdAt}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("tenmgCommission", {
      header: ({ column }) => <p className="">Commission</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
          ₦{info.row.original?.tenmgCommission ?? `0.00`}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("orderId", {
      header: ({ column }) => <p className="">OrderId</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">
            {info.row.original?.orderId}
          </p>
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
    columnHelper.accessor("balanceAfter", {
      header: ({ column }) => <p className="">Balance</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">₦{(info.row.original?.balanceAfter)}</p>
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
                info?.row?.original?.status === "DEBIT"
                  ? "bg-[#FEF3F2] text-[#B42318]"
                  : info?.row?.original?.status === "CREDIT"
                  ? "text-[#027A48] bg-[#ECFDF3]"
                  : "text-orange-500 bg-orange-50",
                " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
              )}
            >
              <span className="rounded-full text-[1.2rem]">•</span>{" "}
              {info?.row?.original?.status}
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
