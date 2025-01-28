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
import { useCartStore } from "../storeFrontState/useCartStore";
import { useRouter } from "next/navigation";

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
  const [localQuantities, setLocalQuantities] = useState<{ [key: number]: number }>({});
  const [subtotal, setSubtotal] = useState<number>(0);

  const router = useRouter();
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const { cart, addToCart, updateLoading, sycnCart } = useCartStore();

  useEffect(() => {
    if (cart) {
      setCartItems(cart);
    }
  }, [cart]);

  useEffect(() => {
    if (cartItems) {
      // Initialize local quantities
      const initialQuantities: { [key: number]: number } = {};
      cartItems?.items?.forEach((item) => {
        initialQuantities[item.product.id] = item.quantity;
      });
      setLocalQuantities(initialQuantities);
    }
  }, [cartItems]);

  // Calculate subtotal whenever localQuantities or cartItems change
  useEffect(() => {
    if (cartItems?.items) {
      let total = 0;
      cartItems?.items?.forEach((item) => {
        const price = parseFloat(item?.product?.discountPrice) > 0 ? parseFloat(item?.product?.actualPrice) - parseFloat(item?.product?.discountPrice) : parseFloat(item?.product?.actualPrice);
        total += price * localQuantities[item.product.id];
      });
      setSubtotal(total);
    }
  }, [localQuantities, cartItems]);

  const handleCheckout = () => {
    const data_array = [];


    // Update the global state with the local quantities
    cartItems?.items?.forEach((item) => {
      console.log("item", item);
      const data = {
        itemId: item.id,
        quantity: localQuantities[item.product.id],
        // action: "update",
      };

      data_array.push(data)
      console.log("updated", data)
    });

    console.log("data_array", data_array);
    const data_obj = {
      cartId: cartItems?.id,
      items: data_array
    }
    console.log("data_obj", data_obj);
    sycnCart(data_obj, userData?.user?.token);
    router.push("/storefront/checkout");
    onClose();
  };

  const updateLocalQuantity = (itemId: number, quantity: number) => {
    setLocalQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  // Function to remove item from cart
  const removeItem = (itemId: number) => {
    const item = cartItems?.items.find((item) => item?.product?.id == itemId).quantity;

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

        <Box mt={2}>
          {/* Cart Items */}
          {cartItems?.items?.length > 0 ? (
            <VStack
              align="start"
              spacing={4}
              className="h-screen lg:h-[50vh] px-2 mx-2  overflow-y-auto  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-primary-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-primary-300
  dark:[&::-webkit-scrollbar-track]:bg-primary-700
  dark:[&::-webkit-scrollbar-thumb]:bg-primary-500"
            >
              {cartItems?.items?.map((item, i) => (
                <CartItemComp
                  key={i}
                  item={item}
                  removeItem={removeItem}
                  updateQuantity={updateLocalQuantity}
                />
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
              <Text fontSize="xl" fontWeight="medium">
                Your cart is empty.
              </Text>
            </Stack>
          )}

          {/* Subtotal */}
          <div className="px-4">
            {cartItems.items?.length > 0 && (
              <>
                <Flex mt={10} justifyContent="flex-end">
                  <Stack mb={4}>
                    <Text fontWeight="medium" fontSize="sm">
                      Subtotal
                    </Text>
                    <Text fontWeight="medium" fontSize="2xl">
                      ₦{subtotal}
                    </Text>
                  </Stack>
                </Flex>

                <Divider />
                {/* Action Buttons */}
                <Stack mt={6} mx={4} spacing={4}>
                  <Button width="full" colorScheme="blue" onClick={handleCheckout}>
                    Checkout
                  </Button>
                  <Button width="full" variant="outline" disabled>
                    Clear Cart
                  </Button>
                </Stack>
              </>
            )}
          </div>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;


const CartItemComp = ({
  item,
  removeItem,
  updateQuantity,
}: {
  item: any;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(item?.quantity);

  const handleIncrease = () => {
    if (quantity < item?.product?.quantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateQuantity(item?.product?.id, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(item?.product?.id, newQuantity);
    }
  };

  return (
    <HStack
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
      <Stack align="start" spacing={2} flex="1" h="full" justify="space-between">
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
            ₦{parseFloat(item?.product?.discountPrice) > 0 ? parseFloat(item?.product?.actualPrice) - parseFloat(item?.product?.discountPrice) : parseFloat(item?.product?.actualPrice)}
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
              cursor: "pointer",
            }}
            aria-label="Decrease quantity"
            onClick={handleDecrease}
            color={quantity === 1 ? "gray.300" : "inherit"}
          />
          <Text>{quantity}</Text>
          <Icon
            as={AiOutlinePlus}
            _hover={{
              cursor: "pointer",
            }}
            aria-label="Increase quantity"
            onClick={handleIncrease}
            color={quantity === item?.product?.quantity ? "gray.300" : "inherit"}
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
        onClick={() => removeItem(item?.product?.id)}
      />
    </HStack>
  );
};