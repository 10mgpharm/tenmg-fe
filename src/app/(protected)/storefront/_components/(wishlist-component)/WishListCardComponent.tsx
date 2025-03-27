import { Badge, Button, Divider } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useCartStore } from "../../(NoSideMenu)/storeFrontState/useCartStore";
import { useWishlistStore } from "../../(NoSideMenu)/storeFrontState/useWIshlist";

export default function WishListCardComponent({ product, token }) {
  const router = useRouter();
  // when user clicks checkout, the item is added to cart
  const { addToCart, updateLoading } = useCartStore();
  const handleAddToCart = (productId: string) => {
    const data = {
      productId,
      qty: 1,
      action: "add",
    };
    addToCart(data, token);
  };

  const { addToWishlist, wishlist, loading, removeWishlistItem } =
    useWishlistStore();

  // removeWishlistItem(wishlistId, userData?.user?.token);

  return (
    <div className="m-4 border border-gray-200 rounded-md p-4">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-5 justify-between items-center">
          <div className="flex items-center gap-2 lg:col-span-4 col-span-1">
            <div
              style={{ backgroundImage: "url('/assets/images/pillImage.png')" }}
              className="size-16 bg-cover bg-center bg-no-repeat"
            />
            <div>
              <h4 className="text-lg font-medium text-gray-700">
                {product?.product?.name}
              </h4>
              <p className="text-sm  text-gray-500 my-1">
                {product?.product?.description}
              </p>
              {/* <p className={`text-sm text-gray-500`}>Quantity: {product?.product??.quantity} Pcs</p> */}
            </div>
          </div>
          <div className="space-y-4 col-span-1">
            <div className="flex items-center gap-3">
              {product?.product?.discountPrice > 0 && (
                <p className="text-gray-900 font-semibold my-2 text-sm">
                  ₦
                  {parseInt(product?.product?.actualPrice) -
                    parseInt(product?.product?.discountPrice)}
                </p>
              )}
              <p
                className={`font-semibold my-2 text-sm ${
                  product?.product?.discountPrice > 0
                    ? "text-gray-400 line-through"
                    : "text-gray-900"
                }`}
              >
                ₦{product?.product?.actualPrice}
              </p>
            </div>
            <div className="space-x-4">
              <Button
                className=""
                variant={"outline"}
                colorScheme={"blue"}
                size="sm"
                onClick={() => {
                  handleAddToCart(product?.product?.id);
                  router.push("/storefront/checkout");
                }}
                disabled={updateLoading}
              >
                Buy Now
              </Button>
              <Button
                variant={"outline"}
                colorScheme={"red"}
                size="sm"
                onClick={() => removeWishlistItem(product?.id, token)}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
