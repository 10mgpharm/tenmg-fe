"use client";

import { formatAmount } from "@/utils/formatAmount";
import {
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { usePaymentStatusStore } from "../../(NoSideMenu)/storeFrontState/usePaymentStatusStore";

export type WhishListProductType = {
  active: number;
  actualPrice: string;
  businessId: number;
  commission: string;
  createdAt: string;
  createdById: number;
  deletedAt: string;
  description: string;
  discountPrice: string;
  ecommerceBrandId: number;
  ecommerceCategoryId: number;
  ecommerceMeasurementId: number;
  ecommerceMedicationTypeId: number;
  ecommercePackageId: number;
  ecommercePresentationId: number;
  ecommerceVariationId: number;
  expiredAt: string;
  id: number;
  lowStockLevel: number;
  maxDeliveryDuration: number;
  minDeliveryDuration: number;
  name: string;
  outStockLevel: number;
  quantity: number;
  slug: string;
  status: string;
  statusComment: string;
  thumbnailFileId: number;
  updatedAt: string;
  updatedById: number;
  valueStrength: string;
  weight: string;
};

const DetailsModal = ({
  isOpen,
  onClose,
  productData,
  addToCart,
  removeWishlistItem,
  disableButton,
  token,
}: {
  isOpen: boolean;
  onClose: () => void;
  productData: WhishListProductType | null;
  addToCart: (productId: number) => void;
  removeWishlistItem: (productId: number, token: string) => void;
  disableButton: boolean;
  token: string;
}) => {
  const router = useRouter();
  const { paymentStatus } = usePaymentStatusStore();
  const isPendingPayment = paymentStatus === "PENDING_MANDATE" || paymentStatus === "INITIATED";

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"sm"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <div className="p-4 mt-5">
          <img
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjij8hX5ojM6ydGboLajqWTkB66LEAdwQB5A&s"
            }
            className="w-full h-fit rounded-md bg-gray-200"
            alt="Product image"
          />

          {/* name */}
          <h3 className="text-[20px] font-medium mt-4">{productData?.name}</h3>

          {/* description */}
          <p className="text-[15px] text-gray-600 pt-1">
            {productData?.description}
          </p>

          {/* detials */}
          <div className="space-y-2 mt-4">
            <li className=" text-[15px] flex items-center gap-3 font-medium">
              {" "}
              Price:
              <span className="flex items-center gap-3">
                {parseInt(productData?.discountPrice) > 0 && (
                  <span className="text-gray-900 font-semibold  text-sm">
                    {formatAmount(
                      parseInt(productData?.actualPrice) -
                        parseInt(productData?.discountPrice)
                    )}
                  </span>
                )}

                <span
                  className={`font-semibold  text-sm ${
                    parseInt(productData?.discountPrice) > 0
                      ? "text-gray-400 line-through"
                      : "text-gray-900"
                  }`}
                >
                  ₦{productData?.actualPrice}
                </span>
              </span>
            </li>

            <li className="text-[15px] flex items-center gap-3 font-medium">
              {" "}
              Weight:
              <span className="text-gray-600 font-normal">
                {productData?.weight}
              </span>
            </li>

            <li className="text-[15px] flex items-center gap-3 font-medium">
              {" "}
              Quantity Left:
              <span className="text-gray-600 font-normal">
                {productData?.quantity}
              </span>
            </li>
          </div>

          {/* Actions */}

          <div className="flex gap-2 mt-6 max-[500px]:flex-col ">
            <Button
              className="flex-1 max-[500px]:py-3"
              onClick={() => {
                addToCart(productData?.id);
                router.push("/storefront/checkout");
              }}
              disabled={disableButton || isPendingPayment}
            
            >
              Buy Now
            </Button>

            <Button
              variant={"outline"}
              className="flex-1  max-[500px]:py-3"
              colorScheme={"red"}
              onClick={() => {
                removeWishlistItem(productData?.id, token);
              }}
              disabled={disableButton}
            >
              Remove
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DetailsModal;
