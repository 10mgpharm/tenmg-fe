import { NextAuthUserSession } from "@/types";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useCartStore } from "../useCartStore";
import { Tag, TagLabel } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function StoreProductCardComponent({ product }: any) {

  const router = useRouter();
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const { addToCart, cart } = useCartStore();

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  const addCartFunction = (prod_id) => {

    console.log("adding")
    const data = {
      productId: prod_id,
      qty: 1,
      action: "add"
    }
    addToCart(data, userData?.user?.token)
  }
  const buyNowFunction = async (prod_id) => {


  }

  // {
  //   "productId": 20,
  //   "qty": 1,
  //   "action": "add" //add or minus or remove
  // }

  console.log('product', product)

  return (
    <div className="w-fit max-w-[311px] px-3 py-3 flex flex-col items-center justify-center shadow-lg rounded-md ">
      <Link href={`/storefront/product/${product?.name}`}>
        <div
          // style={{ backgroundImage: "url('/assets/images/pillImage.png')" }}
          style={{
            backgroundImage: `url(${product?.thumbnailUrl && isValidUrl(product.thumbnailUrl)
              ? product.thumbnailUrl
              : '/assets/images/pillImage.png'
              })`
          }}
          className="w-[279px] h-[186px] bg-gray-50 bg-cover bg-center bg-no-repeat rounded-sm shadow-sm overflow-hidden"
        />
        <div className="w-full">
          <div className="flex items-center justify-between my-2">
            <p className="text-gray-950 font-semibold text-sm capitalize">{product?.name}</p>
            <HeartIcon className="w-6 stroke-primary fill-primary-50" />
          </div>
          {/* <p className="text-gray-500 text-xs my-2">Pentazocine (NEML 23.1)</p> */}
          <div className="relative flex items-center gap-x-2">
            {product?.discountPrice > 0 && <p className="text-gray-900 font-semibold my-2 text-sm left-1/4">₦{product?.discountPrice}</p>}

            <p className={` font-semibold my-2 text-sm ${product?.discountPrice > 0 ? "text-gray-400 line-through" : "text-gray-900"}`}>₦{product?.actualPrice}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
            </div>

            {product?.inventory?.toLowerCase() === "in stock" ? <Tag
              size="sm"
              ml="1"
              borderRadius={"full"}
              color={"green.500"}
              bgColor={"green.100"}
            >
              <TagLabel>{"in stock"}</TagLabel>
            </Tag> :
              <Tag
                size="sm"
                ml="1"
                borderRadius={"full"}
                color={"error.500"}
                bgColor={"error.100"}
              >
                <TagLabel>{"in stock"}</TagLabel>
              </Tag>}

          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between w-full gap-4 my-2">

        <button disabled={product?.inventory?.toLowerCase() !== "in stock"} className="bg-primary-500 text-white w-full py-2 rounded-md text-xs mt-3 font-semibold cursor-pointer" onClick={() => router.push(`/storefront/product/${product?.name}`)}>
          Buy Now
        </button>
        <button className="border border-primary-500 text-primary-500 w-full py-2 rounded-md cursor-pointer text-xs mt-3 font-semibold" onClick={() => addCartFunction(product.id)}>
          Add To Cart
        </button>
      </div>
    </div>
  );
}
//

// In Stock
// Buy Now
// disabled={product?.inventory?.toLowerCase() !== "in stock"}