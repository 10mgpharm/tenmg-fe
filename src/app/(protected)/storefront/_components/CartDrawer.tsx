import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  IconButton,
  Button,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  Stack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import DeleteModal from "./DeleteModal";
import drugs from "@public/assets/images/Rectangle19718.png";
import drugsCard from "@public/assets/images/card.png";
import drugsCh from "@public/assets/images/card1.png";
import emptyCart from "@public/assets/images/emptyOrder.png";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useCartStore } from "../useCartStore";

const CartDrawer = ({
  isOpen,
  onClose,
  handleCloseRemove,
  handleOpenRemove,
  isRemoveOpen,
}: {
  isOpen: boolean;
  isRemoveOpen: boolean;
  onClose: () => void;
  handleCloseRemove: () => void;
  handleOpenRemove: () => void;
}) => {
  const [cartItems, setCartItems] = useState<any>({});

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [isLoading, setIsLoading] = useState(false);

  const { cart, addToCart, updateLoading } = useCartStore();


  useEffect(() => {
    if (cart) {
      setCartItems(cart)
    }
  }, [cart])

  const subtotal = 0;
  // const subtotal = cartItems.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      size="sm"
      isFullHeight={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader p={0} borderBottomWidth="1px">
          <Text fontSize="lg" fontWeight="bold" mb={5} px={4} pt={6}>
            Shopping Cart
          </Text>
        </DrawerHeader>

        <Box p={4} mt={2}>
          {/* Cart Items */}
          {cartItems?.items?.length > 0 ? (
            <VStack align="start" spacing={4} className="overflow-y-scroll">
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

          {/* Subtotal */}
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
                <Button width="full" colorScheme="blue">
                  Checkout
                </Button>
                <Button width="full" variant="outline">
                  View cart
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
