import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { classNames } from "@/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { ProductDataProps } from "@/types";

const columnHelper = createColumnHelper<ProductDataProps>();

export function ColumsProductFN(onOpen: () => void, onOpenRestock: () => void, onOpenDeactivate: () => void) {

  return [
    columnHelper.accessor("id", {
      header: () => (
        <div className="px-6">
          <p>S/N</p>
        </div>
      ),
      cell: (info) => (
        <div className="px-6">
          <p className="font-medium">
            {info?.row?.original?.id} 
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: () => (
        <div className="">
          <p>Product</p>
        </div>
      ),
      cell: (info) => (
        <div className="flex items-center gap-2">
            <Image src={info?.row?.original?.image} alt="" className="w-10 h-10 rounded-full"/>
            <p className="font-medium">
              {info?.row?.original?.name} 
            </p>
        </div>
      ),
    }),
    columnHelper.accessor("brand", {
      header: ({ column }) => (
        <p>Brand Name</p>
      ),
      cell: (info) => {
        return (
          <div>
           <p>{info?.row?.original?.brand}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("weight", {
      header: ({ column }) => (
        <p className="px-5">Weight</p>
      ),
      cell: (info) => (
       <div className="px-5">
        <p className="font-medium">{info.row.original?.weight}</p>
       </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: ({ column }) => (
        <p className="px-5">Category</p>
      ),
      cell: (info) => (
       <div className="px-5">
        <p className="font-medium">{info.row.original?.category}</p>
       </div>
      ),
    }),
    columnHelper.accessor("price", {
      header: ({ column }) => (
        <p className="px-5">Price</p>
      ),
      cell: (info) => (
       <div className="px-5">
        <p className="font-medium">{info.row.original?.price}</p>
       </div>
      ),
    }),
    columnHelper.accessor("quantity", {
      header: ({ column }) => (
        <p className="px-5">Stock</p>
      ),
      cell: (info) => (
       <div className="px-5">
        <p className="font-medium">{info.row.original?.quantity}</p>
       </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <p>Status</p>
      ),
      cell: (info) => {
        return (
          <div>
            <p className={classNames(
            info?.row?.original?.status === "Low" 
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "Available"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : "text-gray-500", " max-w-min p-1 px-2 rounded-2xl text-sm font-medium"
            )}>
              <span className="rounded-full text-[1.2rem]">•</span>
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
                    <Link href={'/admin/products/global-pentazocine'}>View Details</Link>
                  </MenuItem>
                  <MenuItem>Edit Product</MenuItem>
                  <MenuItem onClick={() => onOpenRestock()}>Flag</MenuItem>
                  {
                    info?.row?.original?.status === "Available" ? 
                    <MenuItem onClick={() => onOpenDeactivate()}>Deactivate Product</MenuItem>
                    : <MenuItem onClick={() => onOpenDeactivate()}>Activate Product</MenuItem>
                  }
                  <MenuItem onClick={() => onOpen()} color="red.500">Remove Product</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
  ];
}
