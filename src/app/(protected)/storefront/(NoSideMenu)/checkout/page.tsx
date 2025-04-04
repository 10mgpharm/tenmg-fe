"use client";

import { NextAuthUserSession } from "@/types";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useCartStore } from "../storeFrontState/useCartStore";
import { FiTrash2 } from "react-icons/fi";
import DeleteModal from "../../_components/DeleteModal";
import emptyCart from "@public/assets/images/emptyOrder.png";
import { redirect, useRouter } from "next/navigation";
import BreadCrumbBanner from "../../_components/BreadCrumbBanner";

export default function CheckoutPage() {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const [cartItems, setCartItems] = useState<any>({});
  const [localQuantities, setLocalQuantities] = useState<{
    [key: number]: number;
  }>({});
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const { cart, addToCart, sycnCart, isLoading, cartSize } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (cart) {
      if (cartSize == 0) {
        redirect('/storefront')
      }
    }
  }, [, cart, cartSize])

  useEffect(() => {
    if (cart) {
      setCartItems(cart);
      // Initialize local quantities
      const initialQuantities: { [key: number]: number } = {};
      cartItems?.items?.forEach((item) => {
        initialQuantities[item.product.id] = item.quantity;
      });
      setLocalQuantities(initialQuantities);
    }
  }, [cart, cartItems?.items]);

  // Calculate subtotal whenever localQuantities or cartItems change
  useEffect(() => {
    if (cartItems?.items) {
      let total = 0;
      cartItems.items.forEach((item) => {
        const price =
          item.product?.discountPrice > 0 &&
            item?.product?.actualPrice !== item?.product?.discountPrice
            ? item?.product?.actualPrice - item.product?.discountPrice
            : item?.product?.actualPrice;
        total += price * localQuantities[item.product.id];
      });
      setSubtotal(total);
    }
  }, [localQuantities, cartItems]);

  const [delId, setDelId] = useState(null);
  const handleOpenRemove = () => setIsRemoveOpen(true);
  const handleCloseRemove = () => setIsRemoveOpen(false);

  // Function to increase quantity
  const increaseQuantity = (itemId: number) => {
    if (
      localQuantities[itemId] <
      cartItems.items.find((item) => item.product.id === itemId).product
        .quantity
    ) {
      const newQuantity = localQuantities[itemId] + 1;
      setLocalQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }));
    }
  };

  // Function to decrease quantity
  const decreaseQuantity = (itemId: number) => {
    if (localQuantities[itemId] > 1) {
      const newQuantity = localQuantities[itemId] - 1;
      setLocalQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }));
    }
  };

  const [loadingRemoveItem, setLoadingRemoveItem] = useState(false);

  const removeItem = (itemId: number) => {
    setLoadingRemoveItem(true);
    const data = {
      productId: delId,
      qty: 1,
      action: "remove",
    };
    addToCart(data, userData?.user?.token);
    setLoadingRemoveItem(false);
    setDelId(null);
  };

  const handleCheckout = () => {
    const data_array = [];

    // Update the global state with the local quantities
    cartItems?.items?.forEach((item) => {
      const data = {
        itemId: item.id,
        quantity: localQuantities[item.product.id],
        // action: "update",
      };

      data_array.push(data);
    });

    const data_obj = {
      cartId: cartItems?.id,
      items: data_array,
    };
    sycnCart(data_obj, userData?.user?.token);
    router.push("/storefront/checkout/payment");
    // router.push("/storefront/checkout/payment");
  };

  const breadCrumb = [
    {
      text: "Home",
      link: "/",
    },
    {
      text: "Products",
      link: "/storefront",
    },
    {
      text: `Checkout`,
      link: "#",
    },
  ];

  return (
    <>
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <div>
        {isLoading ? (
          <div className="w-full h-[50vh] flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Box
            p={4}
            mt={2}
            className="grid grid-cols-1 lg:grid-cols-6 w-full lg:w-10/12 mx-auto gap-8"
          >
            <div className="col-span-1 lg:col-span-4 border border-r-gray-100 rounded-2xl">
              <div className="mb-10">
                <h3 className="font-semibold text-lg m-6">Order Summary</h3>
                <Divider className="mt-3" />
              </div>
              {isLoading ? (
                <div className="w-full h-[50vh] flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <div
                  className="h-[60vh] lg:h-[50vh] overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-primary-100
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-primary-300
              dark:[&::-webkit-scrollbar-track]:bg-primary-700
              dark:[&::-webkit-scrollbar-thumb]:bg-primary-500"
                >
                  {cartItems?.items?.length >= 0 ? (
                    <>
                      <VStack align="start" spacing={4} className="p-5">
                        {cartItems?.items?.map((item) => (
                          <HStack
                            key={item?.id}
                            spacing={6}
                            align="flex-start"
                            width="full"
                            justifyContent="space-between"
                            className="hover:bg-primary-50 p-4 rounded-lg"
                          >
                            {/* Product Image */}
                            <Image
                              src={item?.product?.thumbnailFile}
                              alt={item?.product?.name}
                              boxSize={{ base: "100px", md: "128px" }}
                              borderRadius="xl"
                            />

                            {/* Product Details */}
                            <Stack
                              align="start"
                              spacing={2}
                              flex="1"
                              h="full"
                              justify="space-between"
                            >
                              {/* Product Name */}
                              <Text fontWeight="medium" fontSize="md">
                                {item?.product?.name}{" "}
                                {item?.product?.variation?.strengthValue}
                                {item?.product?.measurement?.name}
                              </Text>

                              {/* Stock Information and Price */}
                              <Box>
                                <Text
                                  fontSize="sm"
                                  fontWeight="medium"
                                  color="red.500"
                                >
                                  {item?.product?.quantity} units left
                                </Text>
                                <div className="flex items-center gap-x-2 ">
                                  {item?.product.discountPrice > 0 && (
                                    <p className="text-gray-900 font-semibold my-2 text-sm">
                                      ₦
                                      {parseInt(item?.product.actualPrice) -
                                        parseInt(item?.product.discountPrice)}
                                    </p>
                                  )}
                                  <p
                                    className={`font-semibold my-2 text-sm ${item?.product.discountPrice > 0
                                      ? "text-gray-400 line-through"
                                      : "text-gray-900"
                                      }`}
                                  >
                                    ₦{item?.product.actualPrice}
                                  </p>
                                  {/* ₦{item?.product?.discountPrice > 0 ? item?.product?.actualPrice - item.product?.discountPrice : item?.product?.actualPrice} */}
                                </div>
                              </Box>

                              {/* Quantity Controls */}
                              <HStack
                                borderWidth="1px"
                                borderColor="gray.300"
                                gap={6}
                                px={4}
                                py={2}
                                bgColor="#F0F2F5"
                                color="primary.500"
                                rounded="lg"
                              >
                                <Icon
                                  as={AiOutlineMinus}
                                  _hover={{
                                    cursor:
                                      //  localQuantities[item.product.id] === 1 ||
                                      isLoading ? "not-allowed" : "pointer",
                                  }}
                                  aria-label="Decrease quantity"
                                  onClick={() =>
                                    decreaseQuantity(item?.product?.id)
                                  }
                                  color={
                                    localQuantities[item.product.id] === 1
                                      ? "gray.300"
                                      : "inherit"
                                  }
                                />
                                <Text>{localQuantities[item.product.id]}</Text>
                                <Icon
                                  as={AiOutlinePlus}
                                  _hover={{
                                    cursor:
                                      // localQuantities[item.product.id] === item?.product?.quantity ||
                                      isLoading ? "not-allowed" : "pointer",
                                  }}
                                  aria-label="Increase quantity"
                                  onClick={() =>
                                    increaseQuantity(item?.product?.id)
                                  }
                                  color={
                                    localQuantities[item.product.id] ===
                                      item?.product?.quantity
                                      ? "gray.300"
                                      : "inherit"
                                  }
                                />
                              </HStack>
                            </Stack>

                            {/* Delete Icon */}
                            {loadingRemoveItem ? (
                              <Spinner className="size-3" />
                            ) : (
                              <Icon
                                w={5}
                                h={5}
                                mb={2}
                                alignSelf="center"
                                as={FiTrash2}
                                _hover={{ cursor: "pointer" }}
                                color="error.500"
                                onClick={() => {
                                  handleOpenRemove();
                                  setDelId(item?.product?.id);
                                }}
                              />
                            )}

                            <DeleteModal
                              isOpen={isRemoveOpen}
                              onClose={handleCloseRemove}
                              title="Remove Item"
                              description="remove this item from your shopping cart?"
                              handleDelete={() => removeItem(item?.product?.id)}
                            />
                          </HStack>
                        ))}
                      </VStack>
                    </>
                  ) : (
                    <>
                      <Stack
                        textAlign="center"
                        alignItems="center"
                        mt={10}
                        gap={6}
                      >
                        <Image
                          src={emptyCart.src}
                          alt="Empty Cart"
                          boxSize={{ base: "120px", md: "160px" }}
                        />
                        <Text fontSize="xl" fontWeight="medium">
                          Your cart is empty.
                        </Text>
                      </Stack>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Subtotal */}
            <div className="col-span-1 lg:col-span-2 border border-r-gray-100 rounded-2xl">
              <h3 className="font-semibold text-lg m-6">Amount</h3>
              <Divider className="mt-3" />
              <div className="px-6">
                {isLoading ? (
                  <div className="w-full h-[50vh] flex items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {cartItems.items?.length > 0 && (
                      <>
                        <Flex mt={20}>
                          <Stack mb={4}>
                            <Text fontWeight="medium" fontSize="sm">
                              Subtotal
                            </Text>
                            <Text fontWeight="medium" fontSize="2xl">
                              ₦{subtotal.toLocaleString()}
                            </Text>
                          </Stack>
                        </Flex>

                        <Divider />
                        {/* Action Buttons */}
                        <Stack mt={6} spacing={4}>
                          {/* update cart here */}
                          <Button
                            width="full"
                            colorScheme="blue"
                            onClick={handleCheckout}
                          >
                            {/* <Button width="full" colorScheme="blue" onClick={() => { router.push('/storefront/checkout/payment') }}> */}
                            Proceed to Payment
                          </Button>
                          <Button
                            width="full"
                            variant="outline"
                            onClick={() => router.push("/storefront")}
                          >
                            Continue Shopping
                          </Button>
                        </Stack>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </Box>
        )}
      </div>
    </>
  );
}
