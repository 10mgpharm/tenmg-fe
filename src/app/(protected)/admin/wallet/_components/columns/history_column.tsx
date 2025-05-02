import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@/utils";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { convertDate } from "@/utils/formatDate";

const columnHelper = createColumnHelper<any>();

export function History_ColumnFN(
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
            <p>{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("business.name", {
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
            {info.row.original?.type}
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
                {info?.row?.original?.status === "pending" ? (
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
