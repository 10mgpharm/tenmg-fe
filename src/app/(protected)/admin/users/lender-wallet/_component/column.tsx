import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@/utils";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

const columnHelper = createColumnHelper<any>();

export function LendersWalletColumn(onOpen: (value?: any) => void) {
  return [
    columnHelper.accessor("id", {
      header: () => <p className="pl-6"> S/N</p>,
      cell: (info) => {
        const serialNumber = info?.row?.index + 1;
        return (
          <div className="pl-6">
            <p>{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: () => <p className="pl-6">Name </p>,
      cell: (info) => {
        return (
          <div className="pl-6">
            <p>{info?.row?.original?.name}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("transaction_type", {
      header: () => <p className="">Transaction Type</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium capitalize">
            {info.row.original?.transaction_type}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: () => <p className="">Amount</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">₦{info.row.original?.amount}</p>
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: () => <p className="">Date</p>,
      cell: (info) => (
        <div className="">
          <p className="font-medium">{info.row.original?.date}</p>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: () => <p>Status</p>,
      cell: (info) => {
        return (
          <div>
            <p
              className={classNames(
                info?.row?.original?.status === "Failed"
                  ? "bg-[#FEF3F2] text-[#B42318]"
                  : info?.row?.original?.status === "Completed" ||
                    info?.row?.original?.status === "Successful"
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
    columnHelper.accessor("identifier", {
      header: () => <p className="text-center">Actions</p>,
      cell: (info) => {
        return (
          <Flex justify={"center"}>
            <Menu>
              <MenuButton>
                <BsThreeDotsVertical className="w-5 h-auto" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => onOpen(info?.row?.original)}>
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
