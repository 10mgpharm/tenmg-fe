import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function StoreProductCardComponent({ product }: any) {



  // {
  //   "id": 4,
  //   "name": "paracetemol",
  //   "quantity": 1000,
  //   "actualPrice": "10000.00",
  //   "discountPrice": "5000.00",
  //   "minDeliveryDuration": null,
  //   "maxDeliveryDuration": null,
  //   "thumbnailUrl": "https://tenmg-sanbox-bucket.s3.eu-west-1.amazonaws.com/uploads/files/2024-12-Dec/J51KctD2xWqwuiCy.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARLXAFSIQP34FJGJM%2F20241213%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20241213T094019Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1800&X-Amz-Signature=d528ea12f22570a5cb7e5657f34dd718d645e05fe5d81e960244d1add4ccd132",
  //   "expiredAt": null,
  //   "productDetails": {
  //       "essential": null,
  //       "startingStock": null,
  //       "currentStock": null
  //   },
  //   "status": "ACTIVE",
  //   "inventory": "OUT OF STOCK",
  //   "comment": null
  // }
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  return (
    <div className="w-fit max-w-[311px] px-3 py-3 flex flex-col items-center justify-center shadow-lg rounded-md mx-auto">
      <div
        // style={{ backgroundImage: "url('/assets/images/pillImage.png')" }}
        style={{
          backgroundImage: `url(${product?.thumbnailUrl && isValidUrl(product.thumbnailUrl)
            ? product.thumbnailUrl
            : '/assets/images/pillImage.png'
            })`
        }}
        className="w-[279px] h-[186px] bg-gray-50 bg-cover bg-center bg-no-repeat rounded-sm"
      />
      <div className="w-full">
        <div className="flex items-center justify-between my-2">
          <p className="text-gray-950 font-semibold text-sm">{product?.name}</p>
          <HeartIcon className="w-6 stroke-primary fill-primary-50" />
        </div>
        {/* <p className="text-gray-500 text-xs my-2">Pentazocine (NEML 23.1)</p> */}
        <div className="relative flex items-center gap-x-2">
          {product?.discountPrice && <p className="text-green-500 font-semibold my-2 text-sm left-1/4">{product?.discountPrice}</p>}
          <p className={`text-gray-950 font-semibold my-2 text-sm ${product?.discountPrice > 0 && "text-red-500 line-through"}`}>{product?.actualPrice}</p>
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

        <button className="bg-primary-500 text-white w-full py-2 rounded-md text-xs mt-3 font-semibold">
          Buy Now
        </button>
      </div>
    </div>
  );
}
//

// In Stock
// Buy Now
