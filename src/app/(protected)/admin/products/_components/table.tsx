import Image from "next/image";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { classNames } from "@/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ProductDataProps } from "@/types";

const columnHelper = createColumnHelper<ProductDataProps>();

export function ColumsProductFN(
    onOpen: () => void,
   onOpenRestock: () => void,
   onOpenDeactivate: () => void, 
   onOpenActivate: () => void) 
  {
  return [
    columnHelper.accessor("name", {
      header: () => (
        <div className="pl-6">
          <p>Product</p>
        </div>
      ),
      cell: (info) => (
        <div className="flex items-center gap-2 pl-6">
            <Image src={info?.row?.original?.thumbnailFile} alt="" width={50} height={50} className="w-10 h-10 rounded-full"/>
            <p className="font-medium">
              {info?.row?.original?.name} 
            </p>
        </div>
      ),
    }),
    columnHelper.accessor("inventory", {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Inventory</p>
        </div>
      ),
      cell: (info) => (
        <div>
            <p className={classNames(
            info?.row?.original?.inventory === "LOW STOCK" 
            ? "bg-[#FFFAEB] text-[#F79009]" 
            : info?.row?.original?.inventory === "OUT OF STOCK" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.inventory === "IN STOCK"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-gray-500", " max-w-min p-1 px-2 rounded-2xl text-sm"
            )}>
                <span className="w-3 h-3 rounded-full"></span>
                {" "}
               {info?.row?.original?.inventory}
            </p>
        </div>
      ),
    }),
    columnHelper.accessor("quantity", {
      header: ({ column }) => (
        <p className="px-5">Quantity</p>
      ),
      cell: (info) => (
       <div className="px-5">
        <p className="font-medium">{info.row.original?.quantity}</p>
       </div>
      ),
    }),
    columnHelper.accessor("brand", {
      header: ({ column }) => (
        <p>Brand</p>
      ),
      cell: (info) => {
        return (
          <div>
           <p>{info?.row?.original?.brand?.name}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Status</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className={classNames(
            info?.row?.original?.status === "PENDING"
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "ACTIVE"
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
                        <Link href={'/admin/products/global-pentazocine'}>View Product</Link>
                    </MenuItem>
                    <MenuItem>Edit Product</MenuItem>
                    <MenuItem onClick={() => onOpenRestock()}>Restock</MenuItem>
                    {
                      info?.row?.original?.status === "ACTIVE" ? 
                      <MenuItem onClick={() => onOpenDeactivate()}>Deactivate Product</MenuItem>
                      : <MenuItem onClick={() => onOpenActivate()}>Activate Product</MenuItem>
                    }
                    <MenuItem onClick={() => onOpen()} color="red.500">Delete Product</MenuItem>
                </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
