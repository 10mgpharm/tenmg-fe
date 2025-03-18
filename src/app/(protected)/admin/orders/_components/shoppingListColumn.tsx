import { createColumnHelper } from "@tanstack/react-table";
import { classNames, formatAmountString } from "@/utils";
import { OrderData } from "@/types";
import { convertDate } from "@/utils/formatDate";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { ShoppingList } from "@/types/shoppingList";

export type shoppingListType = {
  id: string;
  customerName: string;
  companyName: string;
  productName: string;
  status: string;
  expectedPurchaseDate: string;
  image: string;
};

const columnHelper = createColumnHelper<ShoppingList>();

export function ShoppingListColumsOrderFN(
  pageIndex: number,
  pageSize: number,
  type: string,
  onOpenDetails: () => void,
  setSelectedOrder: (item: any) => void
) {
  const router = useRouter();

  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="pl-6">
          <p>S/N</p>
        </div>
      ),
      cell: (info) => {
        const serialNumber =
          pageIndex > 1
            ? (pageIndex - 1) * pageSize + info?.row.index + 1
            : info?.row.index + 1;
        return (
          <div>
            <p className="pl-6">{serialNumber}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("customerName", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Customer Name</p>
        </div>
      ),
      cell: (info) => (
        <div className="flex flex-col gap-1">
          <p>
            {/* {info.row.original?.customerName} */}
            Oneyejkwe ugonna
          </p>
          <span className="text-[13px] text-gray-400">
            {/* {info.row.original?.companyName} */}
            LUco pharm
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("productName", {
      header: ({ column }) => <p>Product Name</p>,
      cell: (info) => (
        <div className="">
          <p>{info.row.original?.productName}</p>
        </div>
      ),
    }),
    columnHelper.accessor("purchaseDate", {
      header: ({ column }) => <p>Expected Purchase Date</p>,
      cell: (info) => (
        <div className="">
          <p>{info.row.original?.purchaseDate}</p>
        </div>
      ),
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => <p>Status</p>,
      cell: (info) => {
        return (
          <div>
            <p
              className={classNames(
                info?.row?.original?.status.toUpperCase() === "NOT BOUGHT"
                  ? "bg-[#FFFAEB] text-[#F79009]"
                  : "text-[#027A48] bg-[#ECFDF3]",
                " max-w-min p-1 px-2 rounded-2xl text-xs font-medium  capitalize"
              )}
            >
              <span className="rounded-full text-[1.2rem] pt-4">•</span>{" "}
              {info?.row?.original?.status}
            </p>
          </div>
        );
      },
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => <p>Action</p>,
      cell: (info) => {
        return (
          <Flex justify={"flex-start"}>
            <Menu placement="bottom-start">
              <MenuButton>
                <BsThreeDotsVertical className="" />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    onOpenDetails();
                  }}
                >
                  View Item
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
