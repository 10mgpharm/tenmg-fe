'use client'
import { NextAuthUserSession } from '@/types'
import { Box, Button, Divider, Flex, HStack, Icon, Image, Stack, Text, VStack } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'

import React, { useEffect, useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { useCartStore } from '../useCartStore'
import { FiTrash2 } from 'react-icons/fi'
import DeleteModal from '../_components/DeleteModal'
import emptyCart from "@public/assets/images/emptyOrder.png";
import { useRouter } from 'next/navigation'
import BreadCrumbBanner from '../_components/BreadCrumbBanner'

export default function CheckoutPage() {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const [cartItems, setCartItems] = useState<any>({});
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const handleOpenRemove = () => setIsRemoveOpen(true);
  const handleCloseRemove = () => setIsRemoveOpen(false);

  const { cart, addToCart, updateLoading } = useCartStore();

  const router = useRouter()

  useEffect(() => {
    if (cart) {
      setCartItems(cart)
    }
  }, [cart])

  // Function to increase quantity
  const increaseQuantity = async (itemId: number) => {

    const item = cartItems?.items.find((item) => item?.product?.id == itemId).quantity;
    console.log("item qty", item)
    const data = {
      productId: itemId,
      qty: 1,
      action: 'add'
    }
    addToCart(data, userData?.user?.token)
  };

  // Function to decrease quantity
  const decreaseQuantity = (itemId: number) => {

    const item = cartItems?.items.find((item) => item?.product?.id == itemId).quantity;
    console.log("item qty", item)
    const data = {
      productId: itemId,
      qty: 1,
      action: 'minus'
    }

    addToCart(data, userData?.user?.token)
  };

  // Function to remove item from cart
  const removeItem = (itemId: number) => {
    const item = cartItems?.items.find((item) => item?.product?.id == itemId).quantity;
    console.log("item qty", item)
    const data = {
      productId: itemId,
      qty: 1,
      action: 'remove'
    }

    addToCart(data, userData?.user?.token)
  };

  const breadCrumb = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Products',
      link: '/storefront'
    },
    {
      text: `Checkout`,
      link: '#'
    }
  ]

  return (
    <>
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <div>
        <Box p={4} mt={2} className='grid grid-cols-1 lg:grid-cols-6 w-full lg:w-10/12 mx-auto gap-8'>
          <div className='col-span-1 lg:col-span-4 border border-r-gray-100 rounded-2xl'>

            <div className='mb-10'>
              <h3 className='font-semibold text-lg m-6'>Order Summary</h3>
              <Divider className='mt-3' />
            </div>

            {/* Cart Items */}
            {cartItems?.items?.length > 0 ? (
              <VStack align="start" spacing={4} className="">
                {cartItems?.items?.map((item) => (
                  <HStack
                    key={item?.id}
                    spacing={6}
                    align="flex-start"
                    width="full"
                    justifyContent="space-between"
                    h={{ md: 32 }}
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
                        {item?.product?.name}
                      </Text>

                      {/* Stock Information and Price */}
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="red.500">
                          {item?.product?.quantity} units left
                        </Text>
                        <Text fontSize="md" fontWeight="medium">
                          ₦{item?.discountPrice > 0 ? item?.discountPrice : item?.actualPrice}
                          {/* ₦{item?.price?.toLocaleString()}.00 */}
                        </Text>
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
                              item.quantity === 1 || updateLoading ? "not-allowed" : "pointer",
                          }}
                          aria-label="Decrease quantity"
                          onClick={() => decreaseQuantity(item?.product?.id)}
                          color={item.quantity === 1 ? "gray.300" : "inherit"}
                        />
                        <Text>{item.quantity}</Text>
                        <Icon
                          as={AiOutlinePlus}
                          _hover={{
                            cursor:
                              item?.quantity === item?.product?.quantity || updateLoading
                                ? "not-allowed"
                                : "pointer",
                          }}
                          aria-label="Increase quantity"
                          onClick={() => increaseQuantity(item?.product?.id)}
                          color={
                            item?.quantity === item?.product?.quantity ? "gray.300" : "inherit"
                          }
                        />
                      </HStack>
                    </Stack>

                    {/* Delete Icon */}
                    <Icon
                      w={5}
                      h={5}
                      mb={2}
                      alignSelf="flex-end"
                      as={FiTrash2}
                      _hover={{ cursor: "pointer" }}
                      color="error.500"
                      onClick={handleOpenRemove}
                    />

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
            ) : (
              // Empty Cart State
              <Stack textAlign="center" alignItems="center" mt={10} gap={6}>
                <Image
                  src={emptyCart.src}
                  alt="Empty Cart"
                  boxSize={{ base: "120px", md: "160px" }}

                />
                <Text fontSize="xl" fontWeight="medium">Your cart is empty.</Text>
              </Stack>
            )}
          </div>

          {/* Subtotal */}
          <div className='col-span-1 lg:col-span-2 border border-r-gray-100 rounded-2xl'>
            <h3 className='font-semibold text-lg m-6'>Amount</h3>
            <Divider className='mt-3' />
            <div className='px-6'>
              {cartItems.items?.length > 0 && (
                <>
                  <Flex mt={20} justifyContent="flex-end">
                    <Stack mb={4}>
                      <Text fontWeight="medium" fontSize="sm">
                        Subtotal
                      </Text>
                      <Text fontWeight="medium" fontSize="2xl">
                        ₦{cartItems?.orderTotal.toLocaleString()}
                      </Text>
                    </Stack>
                  </Flex>

                  <Divider />
                  {/* Action Buttons */}
                  <Stack mt={6} spacing={4}>
                    <Button width="full" colorScheme="blue" onClick={() => router.push('/storefront/checkout/payment')}>
                      Proceed to payment
                    </Button>
                    <Button width="full" variant="outline" onClick={() => router.push('/storefront')}>
                      Continue shopping
                    </Button>
                  </Stack>
                </>
              )}
            </div>
          </div>
        </Box>
      </div>
    </>
  )
}
