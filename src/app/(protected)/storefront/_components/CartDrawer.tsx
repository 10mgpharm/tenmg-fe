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
import { useCartStore } from "../(NoSideMenu)/storeFrontState/useCartStore";
import { usePaymentStatusStore } from "../(NoSideMenu)/storeFrontState/usePaymentStatusStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
  const [localQuantities, setLocalQuantities] = useState<{
    [key: number]: number;
  }>({});
  const [subtotal, setSubtotal] = useState<number>(0);

  const router = useRouter();
  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const { cart, addToCart, updateLoading, sycnCart, fetchCart, clearCart } =
    useCartStore();
  const { paymentStatus } = usePaymentStatusStore();
  const isPendingPayment = paymentStatus === "PENDING_MANDATE" || paymentStatus === "INITIATED";

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
        const price =
          parseFloat(item?.product?.discountPrice) > 0
            ? parseFloat(item?.product?.actualPrice) -
            parseFloat(item?.product?.discountPrice)
            : parseFloat(item?.product?.actualPrice);
        total += price * localQuantities[item.product.id];
      });
      setSubtotal(total);
    }
  }, [localQuantities, cartItems]);

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
    if (isPendingPayment) {
      toast.error("Complete your pending payment to continue shopping");
      return;
    }
    
    const item = cartItems?.items.find(
      (item) => item?.product?.id == itemId
    ).quantity;

    const data = {
      productId: itemId,
      qty: 1,
      action: "remove",
    };

    addToCart(data, userData?.user?.token);
  };

  const handleClearCart = async () => {
    if (isPendingPayment) {
      toast.error("Complete your pending payment to continue shopping");
      return;
    }
    
    clearCart(userData?.user?.token);
    onClose();
    window.location.reload();
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

        <Box mt={2} className="overflow-y-auto">
          {/* Cart Items */}
          {cartItems?.items?.length > 0 ? (
            <VStack
              align="start"
              spacing={4}
              className="h-[50vh] px-2 mx-2 my-2  overflow-y-auto  [&::-webkit-scrollbar]:w-2
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
                  isPendingPayment={isPendingPayment}
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
                  <Button
                    width="full"
                    colorScheme="blue"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                  <Button
                    width="full"
                    variant="outline"
                    onClick={handleClearCart}
                    disabled={isPendingPayment}
                  >
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
  isPendingPayment,
}: {
  item: any;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  isPendingPayment: boolean;
}) => {
  const [quantity, setQuantity] = useState(item?.quantity);

  const handleIncrease = () => {
    if (isPendingPayment) {
      toast.error("Complete your pending payment to continue shopping");
      return;
    }
    
    if (quantity < item?.product?.quantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateQuantity(item?.product?.id, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (isPendingPayment) {
      toast.error("Complete your pending payment to continue shopping");
      return;
    }
    
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(item?.product?.id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (isPendingPayment) {
      toast.error("Complete your pending payment to continue shopping");
      return;
    }
    removeItem(item?.product?.id);
  };

  return (
    <HStack
      spacing={6}
      align="flex-start"
      width="full"
      justifyContent="space-between"
      h={{ md: 32 }}
      my={2}
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
        spacing={1}
        flex="1"
        h="full"
        justify="space-between"
      >
        {/* Product Name */}
        <Text fontWeight="medium" fontSize="md">
          {item?.product?.name} {item?.product?.variation?.strengthValue}
          {item?.product?.measurement?.name}
        </Text>

        {/* Stock Information and Price */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="red.500">
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
            {/* ₦{parseFloat(item?.product?.discountPrice) > 0 ? parseFloat(item?.product?.actualPrice) - parseFloat(item?.product?.discountPrice) : parseFloat(item?.product?.actualPrice)} */}
          </div>
        </Box>

        {/* Quantity Controls */}
        <HStack
          borderWidth="1px"
          borderColor="gray.300"
          gap={6}
          px={4}
          py={1}
          bgColor="#F0F2F5"
          color="primary.500"
          rounded="lg"
          opacity={isPendingPayment ? 0.5 : 1}
        >
          <Icon
            as={AiOutlineMinus}
            _hover={{
              cursor: isPendingPayment ? "not-allowed" : "pointer",
            }}
            aria-label="Decrease quantity"
            onClick={handleDecrease}
            color={quantity === 1 || isPendingPayment ? "gray.300" : "inherit"}
          />
          <Text>{quantity}</Text>
          <Icon
            as={AiOutlinePlus}
            _hover={{
              cursor: isPendingPayment ? "not-allowed" : "pointer",
            }}
            aria-label="Increase quantity"
            onClick={handleIncrease}
            color={
              quantity === item?.product?.quantity || isPendingPayment ? "gray.300" : "inherit"
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
        _hover={{ cursor: isPendingPayment ? "not-allowed" : "pointer" }}
        color={isPendingPayment ? "gray.300" : "error.500"}
        onClick={handleRemove}
        opacity={isPendingPayment ? 0.5 : 1}
      />
    </HStack>
  );
};
