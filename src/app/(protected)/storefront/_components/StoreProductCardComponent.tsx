import { NextAuthUserSession } from "@/types";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCartStore } from "../storeFrontState/useCartStore";
import { Tag, TagLabel } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BusinessStatus } from "@/constants";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { useWishlistStore } from "../storeFrontState/useWIshlist";


export default function StoreProductCardComponent({ product }: any) {
  const router = useRouter();
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [cartList, setAddCartlist] = useState(null);
  const [addedTocart, setAddedToCart] = useState(false);
  const { addToCart, updateLoading, cart } = useCartStore();
  const { addToWishlist, wishlist, loading, removeWishlistItem } = useWishlistStore();

  useEffect(() => {
    setAddedToWishlist(wishlist.findIndex((item) => item?.productId === product?.id) >= 0)
  }, [wishlist, product])

  useEffect(() => {
    if (cart) {
      setAddCartlist(cart)
    }
  }, [cart])

  useEffect(() => {
    if (cartList) {
      setAddedToCart(cartList?.items?.findIndex((item) => item?.product?.id === product?.id) >= 0)
    }
  }, [cartList, product])

  const businessStatus = userData?.user?.businessStatus;

  const isProductClickable = ![
    BusinessStatus.PENDING_VERIFICATION,
    BusinessStatus.PENDING_APPROVAL,
    BusinessStatus.REJECTED,
    BusinessStatus.LICENSE_EXPIRED,
    BusinessStatus.SUSPENDED,
    BusinessStatus.BANNED,
  ].includes(businessStatus as BusinessStatus);

  const handleAddToCart = (productId: string, action: string) => {
    const data = {
      productId,
      qty: 1,
      action,
    };
    addToCart(data, userData?.user?.token);
  };


  const handleWishlistClick = async (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation(); // Prevent event propagation to the parent Link
    if (addedToWishlist === true) {
      const wishlistId = wishlist.find((item) => item?.productId === product?.id).id
      setAddedToWishlist(false);
      removeWishlistItem(wishlistId, userData?.user?.token, setAddedToWishlist);
    } else {
      setAddedToWishlist(true);
      addToWishlist(id, userData?.user?.token, setAddedToWishlist)
    }

  };



  const renderProductImage = () => (
    <div
      style={{ backgroundImage: `url(${product?.thumbnailFile})` }}
      className="w-[279px] h-[186px] bg-gray-50 bg-cover bg-center bg-no-repeat rounded-sm shadow-sm overflow-hidden"
    />
  );

  const renderProductDetails = () => (
    <div className="w-full">
      <div className="flex items-center justify-between my-2">
        <p className="text-gray-950 font-semibold text-sm capitalize">{product?.name} {product?.variation?.strengthValue}{product?.measurement?.name}</p>
        <div className="relative z-10 cursor-pointer" onClick={(e) => handleWishlistClick(e, product?.id)}>
          <HeartIcon className={`w-6 stroke-primary ${addedToWishlist ? "fill-primary-500" : "fill-primary-50"}`} />
        </div>
      </div>
      <div className="relative flex items-center gap-x-2">
        {product?.discountPrice > 0 && (
          <p className="text-gray-900 font-semibold my-2 text-sm">
            ₦{parseInt(product?.actualPrice) - parseInt(product?.discountPrice)}
          </p>
        )}
        <p className={`font-semibold my-2 text-sm ${product?.discountPrice > 0 ? "text-gray-400 line-through" : "text-gray-900"}`}>
          ₦{product?.actualPrice}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-5 fill-warning-400 stroke-none" />
          ))}
        </div>
        <Tag
          size="sm"
          ml="1"
          borderRadius="full"
          color={product?.inventory?.toLowerCase() === "in stock" ? "green.500" : "error.500"}
          bgColor={product?.inventory?.toLowerCase() === "in stock" ? "green.100" : "error.100"}
        >
          <TagLabel>{product?.inventory?.toLowerCase()}</TagLabel>
        </Tag>
      </div>
    </div>
  );

  const renderButtons = () => (
    <div className="flex items-center justify-between w-full gap-4 my-2">
      <button
        disabled={!isProductClickable || product?.inventory?.toLowerCase() !== "in stock"}
        className="bg-primary-500 text-white w-full py-2 rounded-md text-xs mt-3 font-semibold cursor-pointer disabled:cursor-not-allowed"
        onClick={() => {
          handleAddToCart(product?.id, "add");
          router.push("/storefront/checkout");
        }}
      >
        Buy Now
      </button>
      <button
        disabled={!isProductClickable || updateLoading}
        className="border border-primary-500 text-primary-500 w-full py-2 rounded-md cursor-pointer text-xs mt-3 font-semibold disabled:cursor-not-allowed"
        onClick={() => { handleAddToCart(product?.id, addedTocart ? "remove" : "add") }}
      >
        {addedTocart ? "Remove From Cart" : "Add To Cart"}
      </button>
    </div>
  );

  return (
    <div className="w-fit max-w-[311px] px-3 py-3 flex flex-col items-center justify-center shadow-lg rounded-md">
      {isProductClickable ? (
        <div>
          <Link href={`/storefront/product/${product?.slug}`}>
            {renderProductImage()}
          </Link>
          {renderProductDetails()}
        </div>
      ) : (
        <div className="pointer-events-none cursor-not-allowed">
          {renderProductImage()}
          {renderProductDetails()}
        </div>
      )}
      {renderButtons()}
    </div>
  );
}

