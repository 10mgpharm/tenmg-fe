import { NextAuthUserSession } from "@/types";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCartStore } from "../(NoSideMenu)/storeFrontState/useCartStore";
import { Tag, TagLabel } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BusinessStatus } from "@/constants";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { useWishlistStore } from "../(NoSideMenu)/storeFrontState/useWIshlist";
import { LoaderIcon } from "lucide-react";
import RatingComponent from "./RatingComponent";
import { cn } from "@/lib/utils";

export default function StoreProductCardComponent({
  product,
  flexible,
}: {
  flexible?: boolean;
  product: any;
}) {
  const router = useRouter();
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [cartList, setAddCartlist] = useState(null);
  const [addedTocart, setAddedToCart] = useState(false);
  const { addToCart, updateLoading, cart } = useCartStore();
  const { addToWishlist, wishlist, loading, removeWishlistItem } =
    useWishlistStore();

  useEffect(() => {
    setAddedToWishlist(
      wishlist?.findIndex((item) => item?.productId === product?.id) >= 0
    );
  }, [wishlist, product]);

  useEffect(() => {
    if (cart) {
      setAddCartlist(cart);
    }
  }, [cart]);

  useEffect(() => {
    if (cartList) {
      setAddedToCart(
        cartList?.items?.findIndex(
          (item) => item?.product?.id === product?.id
        ) >= 0
      );
    }
  }, [cartList, product]);

  const businessStatus = userData?.user?.businessStatus;

  const isProductClickable = ![
    BusinessStatus.PENDING_VERIFICATION,
    BusinessStatus.PENDING_APPROVAL,
    BusinessStatus.REJECTED,
    BusinessStatus.SUSPENDED,
    BusinessStatus.BANNED,
  ].includes(businessStatus as BusinessStatus);

  const [loadingAddToCart, setLoadingAddToCart] = useState(false);

  const handleAddToCart = async (productId: string, action: string) => {
    setLoadingAddToCart(true);
    const data = {
      productId,
      qty: 1,
      action,
    };
    await addToCart(data, userData?.user?.token).then((res) =>
      setLoadingAddToCart(false)
    );
  };

  const handleWishlistClick = async (
    e: React.MouseEvent,
    id: number | string
  ) => {
    e.stopPropagation(); // Prevent event propagation to the parent Link
    if (addedToWishlist === true) {
      const wishlistId = wishlist.find(
        (item) => item?.productId === product?.id
      )?.id;
      setAddedToWishlist(false);
      removeWishlistItem(wishlistId, userData?.user?.token, setAddedToWishlist);
    } else {
      setAddedToWishlist(true);
      addToWishlist(id, userData?.user?.token, setAddedToWishlist);
    }
  };

  const renderProductImage = () => (
    <div
      style={{ backgroundImage: `url(${product?.thumbnailFile})` }}
      className={cn(
        " bg-gray-50 bg-cover bg-center bg-no-repeat rounded-lg shadow-sm overflow-hidden",
        flexible ? "aspect-[4/3] w-full" : "w-[279px] h-[186px]"
      )}
    />
  );


  const renderProductDetails = () => (

    <div className="w-full">
      <div className="flex items-center justify-between my-2">
        <p className="text-gray-950 font-semibold text-sm capitalize">
          {product?.name} {product?.variation?.strengthValue}
          {product?.measurement?.name}
        </p>
        <div
          className="relative z-10 cursor-pointer"
          onClick={(e) => handleWishlistClick(e, product?.id)}
        >
          <HeartIcon
            className={`w-6 stroke-primary ${addedToWishlist ? "fill-primary-500" : "fill-primary-50"
              }`}
          />
        </div>
      </div>
      <div className="relative flex items-center gap-x-2">
        {product?.discountPrice > 0 && (
          <p className="text-gray-900 font-semibold my-2 text-sm">
            ₦{parseInt(product?.actualPrice) - parseInt(product?.discountPrice)}
          </p>
        )}
        <p
          className={`font-semibold my-2 text-sm ${product?.discountPrice > 0
            ? "text-gray-400 line-through"
            : "text-gray-900"
            }`}
        >
          ₦{product?.actualPrice}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <RatingComponent
            rating={product?.rating?.avgRating
              ? Math.round(product?.rating?.avgRating
              ) : 0}
            handleRating={() => { }}
            readonly={true}
          />
        </div>
        <Tag
          size="sm"
          ml="1"
          borderRadius="full"
          color={
            product?.quantity <= (product?.outStockLevel ?? 0)
              ? "error.500"
              : product?.quantity >= (product?.outStockLevel ?? 0) && product?.quantity <= product?.lowStockLevel
                ? "warning.500"
                : "green.500"
          }
          bgColor={
            product?.quantity <= (product?.outStockLevel ?? 0)
              ? "error.100"
              : product?.quantity >= (product?.outStockLevel ?? 0) && product?.quantity <= product?.lowStockLevel
                ? "warning.100"
                : "green.100"
          }
        >
          <TagLabel className="">
            {
              product?.quantity <= (product?.outStockLevel ?? 0)
                ? "Out of Stock"
                : product?.quantity >= (product?.outStockLevel ?? 0) && product?.quantity <= product?.lowStockLevel
                  ? "Low In Stock"
                  : "In Stock"
            }
          </TagLabel>
        </Tag>
      </div>
    </div >
  );

  const [loadingBuynow, setLoadingBuynow] = useState(false);
  const buyNowFunction = () => {
    setLoadingBuynow(true);
    if (product?.quantity <= (product?.outStockLevel ?? 0)) {
      toast.error("Product is out of stock");
      setLoadingBuynow(false);
      return;
    }
    try {

      handleAddToCart(product?.id, "add");
      router.push("/storefront/checkout");
      setLoadingBuynow(false);
    } catch (e) {
      toast.error("An error occurred, please try again");
      setLoadingBuynow(false);
    }
  }

  const [loadingAdd, setLoadingAdd] = useState(false);
  const addToCartFunction = () => {
    setLoadingAdd(true);
    if (product?.quantity <= (product?.outStockLevel ?? 0)) {
      toast.error("Product is out of stock");
      setLoadingAdd(false);
      return;
    }
    handleAddToCart(product?.id, addedTocart ? "remove" : "add");
    setLoadingAdd(false);
  }

  const renderButtons = () => (
    <div className="flex items-center justify-between w-full gap-4 my-2">
      <button
        disabled={
          !isProductClickable ||
          product?.quantity <= (product?.outStockLevel ?? 0)
        }
        className="bg-primary-500 text-white w-full py-2 rounded-md text-xs mt-3 font-semibold cursor-pointer disabled:cursor-not-allowed"
        onClick={buyNowFunction}
      // onClick={() => {
      //   handleAddToCart(product?.id, "add");
      //   router.push("/storefront/checkout");
      // }}
      >
        {loadingBuynow ? <LoaderIcon className="size-3 mx-auto" /> : "Buy Now"}
      </button>
      <button
        disabled={!isProductClickable || updateLoading || loadingAdd || loadingBuynow || product?.quantity <= (product?.outStockLevel ?? 0)}
        className="border border-primary-500 text-primary-500 w-full py-2 rounded-md cursor-pointer text-xs mt-3 font-semibold disabled:cursor-not-allowed"
        onClick={addToCartFunction}
      // onClick={() => {
      //   handleAddToCart(product?.id, addedTocart ? "remove" : "add");
      // }}
      >
        {loadingAdd ? (
          <LoaderIcon className="size-3 mx-auto" />
        ) : addedTocart ? (
          "Remove From Cart"
        ) : (
          "Add To Cart"
        )}
      </button>
    </div>
  );

  return (
    <div
      className={cn(
        " px-3 py-3 mx-4 flex flex-col items-center justify-center shadow-lg rounded-md",
        flexible ? "w-full" : "w-fit max-w-[311px]"
      )}
    >
      {isProductClickable ? (
        <div className="w-full">
          <Link href={`/storefront/product/${product?.slug}`}>
            {renderProductImage()}
          </Link>
          {renderProductDetails()}
        </div>
      ) : (
        <div className="pointer-events-none cursor-not-allowed w-full">
          {renderProductImage()}
          {renderProductDetails()}
        </div>
      )}
      {renderButtons()}
    </div>
  );
}
