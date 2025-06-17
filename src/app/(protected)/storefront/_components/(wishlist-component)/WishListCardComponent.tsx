import {
  Badge,
  Button,
  Divider,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCartStore } from "../../(NoSideMenu)/storeFrontState/useCartStore";
import { usePaymentStatusStore } from "../../(NoSideMenu)/storeFrontState/usePaymentStatusStore";
import { useWishlistStore } from "../../(NoSideMenu)/storeFrontState/useWIshlist";
import DetailsModal from "./DetailsModal";
import { WhishListProductType } from "@/types/wishlist";

export default function WishListCardComponent({ product, token }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedProduct, setSelectedProduct] =
    useState<WhishListProductType | null>(null);

  const router = useRouter();
  // when user clicks checkout, the item is added to cart
  const { addToCart, updateLoading } = useCartStore();
  const { paymentStatus } = usePaymentStatusStore();
  const handleAddToCart = (productId: number) => {
    const data = {
      productId,
      qty: 1,
      action: "add",
    };
    addToCart(data, token);
  };

  const { removeWishlistItem } = useWishlistStore();
  const isPendingPayment =
    paymentStatus === "PENDING_MANDATE" || paymentStatus === "INITIATED";

  const handleClick = (e) => {
    // If a button was clicked (or a child of a button), don't open modal
    if (e.target.closest("button")) return;

    // Otherwise, open the modal
    onOpen();
    setSelectedProduct(product?.product);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="m-4 border border-gray-200 rounded-md p-3 hover:bg-primary/5 cursor-pointer"
      >
        <div className="flex items-center gap-4 md:gap-8 max-sm:flex-col max-sm:items-start max-sm:gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div
              style={{
                backgroundImage: `url(${product?.product?.thumbnailFile})`,
              }}
              className="size-16 min-h-16 min-w-16 bg-cover bg-center bg-no-repeat rounded-md"
            />
            <div>
              <h4 className="text-lg font-medium text-gray-700">
                {product?.product?.name}
              </h4>
              <p className="text-sm  text-gray-500  line-clamp-2 max-w-md">
                {product?.product?.description}
              </p>
            </div>
          </div>

          <div className="space-y-2 w-[200px]">
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
            <div className="gap-4 flex">
              <Button
                className=""
                variant={"outline"}
                colorScheme={"blue"}
                size="sm"
                onClick={() => {
                  handleAddToCart(product?.product?.id);
                  router.push("/storefront/checkout");
                }}
                disabled={updateLoading || isPendingPayment}
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

      <DetailsModal
        isOpen={isOpen}
        onClose={onClose}
        productData={selectedProduct}
        addToCart={handleAddToCart}
        removeWishlistItem={() => removeWishlistItem(product?.id, token)}
        disableButton={updateLoading}
        token={token}
      />
    </>
  );
}
