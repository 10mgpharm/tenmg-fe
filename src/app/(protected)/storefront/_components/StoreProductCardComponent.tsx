import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

export default function StoreProductCardComponent({ product }: any) {


  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
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
            {product?.discountPrice && <p className="text-green-500 font-semibold my-2 text-sm left-1/4">₦{product?.discountPrice}</p>}
            <p className={`text-gray-950 font-semibold my-2 text-xs ${product?.discountPrice > 0 && "text-red-500 line-through"}`}>₦{product?.actualPrice}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
              <StarIcon className="w-5 fill-warning-400 stroke-none" />
            </div>

            {product?.inventory?.toLowerCase() === "in stock" ? <p className='w-fit py-1 px-3 rounded-3xl bg-green-100'><span className='text-green-700 text-[12px] font-semibold'>In Stock</span></p> :
              <p className="w-fit py-1 px-3 rounded-3xl bg-red-100">
                <span className="text-red-700 text-[12px] font-semibold">
                  Out of Stock
                </span>
              </p>}
          </div>
        </div>
      </Link>

      <button className="bg-primary-500 text-white w-full py-2 rounded-md text-xs mt-3 font-semibold">
        Buy Now
      </button>
    </div>
  );
}
//

// In Stock
// Buy Now
