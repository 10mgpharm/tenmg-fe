
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { 
  Flex, 
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuList 
} from "@chakra-ui/react";
import { classNames } from "@/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ProductDataProps } from "@/types";
import { Dispatch, SetStateAction } from "react";

const columnHelper = createColumnHelper<ProductDataProps>();

export function ColumsProductFN(
    onOpen: () => void,
    onOpenRestock: () => void,
    onOpenDeactivate: () => void, 
    onOpenActivate: () => void,
    setSelectedProduct: Dispatch<SetStateAction<ProductDataProps>>
  ) 
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
          {
            info.row.original?.thumbnailFile && 
            <img 
            src={info?.row?.original?.thumbnailFile} 
            alt="" 
            width={35} 
            height={35} 
            className="w-8 h-8 rounded-full"
            />
          }
          <Link className="capitalize font-medium" href={`/suppliers/products/${info.row.original.id}`}>
            {info?.row?.original?.name}
          </Link>
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
            <p className="capitalize font-medium">
            {info?.row?.original?.brand?.name}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("weight", {
      header: ({ column }) => (
        <p>Weight</p>
      ),
      cell: (info) => {
        return (
          <div>
           <p className="font-medium">{info?.row?.original?.weight}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: ({ column }) => (
        <p>Category</p>
      ),
      cell: (info) => {
        return (
          <div>
           <p className="font-medium">{info?.row?.original?.category?.name}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("actualPrice", {
      header: ({ column }) => (
        <p>Price</p>
      ),
      cell: (info) => {
        const productPrice = Number(info.row.original?.actualPrice) - Number(info.row.original?.discountPrice);
        return (
          <div>
           <p className="font-medium">
           {productPrice?.toLocaleString()}
          </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("quantity", {
      header: ({ column }) => (
        <p className="px-5">Stock</p>
      ),
      cell: (info) => (
       <div className="px-5">
        <p className="font-medium">
          {Number(info.row.original?.quantity)?.toLocaleString()}
        </p>
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
            (info?.row?.original?.status === "PENDING" || info.row.original.status === "INACTIVE")
            ? "bg-[#FEF3F2] text-[#B42318]" 
            : info?.row?.original?.status === "ACTIVE"
            ? "text-[#027A48] bg-[#ECFDF3]"
            : info.row.original?.status === "APPROVED"
            ? "bg-blue-50 text-blue-500"
            : info.row.original?.status === "FLAGGED"
            ? "bg-orange-50 text-orange-500"
            : "text-gray-500", " max-w-min p-0.5 px-2 rounded-2xl text-[11px] capitalize font-medium"
            )}>
                <span className="text-[1.2rem] rounded-full">•</span>
                {" "}
                {info?.row?.original?.status === "APPROVED" ? "ACTIVE" : info.row.original?.status}
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
                <BsThreeDotsVertical className="w-5 h-auto" />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link href={`/suppliers/products/${info.row.original.id}`}>View Product</Link>
                </MenuItem>
                <MenuItem>
                  <Link href={`/suppliers/products/edit/${info.row.original.id}`}>Edit Product</Link>
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    setSelectedProduct(info.row.original);
                    onOpenRestock();
                  }}>
                    Restock
                  </MenuItem>
                  {(info?.row?.original?.status === "ACTIVE" || info.row.original?.status === "APPROVED") ? (
                  <MenuItem onClick={() => {
                    setSelectedProduct(info.row.original);
                    onOpenDeactivate()
                    }}>
                    Deactivate Product
                  </MenuItem>
                ) : (info.row.original.status === "PENDING" || info.row.original.status === "INACTIVE") ? (
                  <MenuItem onClick={() => {
                    setSelectedProduct(info.row.original);
                    onOpenActivate()
                    }}>
                    Activate Product
                  </MenuItem>
                ) : <></>
              }
                <MenuItem onClick={() => {
                  setSelectedProduct(info.row.original);
                  onOpen();
                  }} 
                  color="red.500">
                  Delete Product
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        );
      },
    }),
    
  ];
}
