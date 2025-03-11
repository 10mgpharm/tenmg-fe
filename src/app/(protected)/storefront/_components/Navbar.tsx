"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
  Text,
  HStack,
  Icon,
  Stack,
  VStack,
  IconButton,
  Button,
  Avatar,
  Flex,
  Spinner,
} from "@chakra-ui/react";

import { BellIcon, Search, UserCircle2Icon } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
// import avatar from "@public/assets/images/Avatar.png";
import Logo from "@public/assets/images/10mg logo.svg";
import { PiShoppingBagBold } from "react-icons/pi";
import { FaRegCircleQuestion } from "react-icons/fa6";
import CartDrawer from "./CartDrawer";
import SearchModal from "./SearchModal";
import Link from "next/link";
import { useCartStore } from "../storeFrontState/useCartStore";
import { NextAuthUserSession } from "@/types";
import { BusinessStatus } from "@/constants";
import requestClient from "@/lib/requestClient";
import { IoIosNotifications, IoMdNotificationsOutline } from "react-icons/io";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  const handleOpenRemove = () => setIsRemoveOpen(true);
  const handleCloseRemove = () => setIsRemoveOpen(false);

  const [cartDataCount, setCartDataCount] = useState(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const { fetchCart, cartSize } = useCartStore();

  const businessStatus = userData?.user?.businessStatus;

  const isRestrictedStatus = [
    BusinessStatus.PENDING_VERIFICATION,
    BusinessStatus.PENDING_APPROVAL,
    BusinessStatus.REJECTED,
    BusinessStatus.LICENSE_EXPIRED,
    BusinessStatus.SUSPENDED,
    BusinessStatus.BANNED,
  ].includes(businessStatus);

  useEffect(() => {
    if (userData?.user?.token) fetchCart(userData?.user?.token);
  }, [isCartOpen, fetchCart, userData?.user?.token]);

  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const fetchingData = async () => {
    setLoading(true)
    try {
      const response = await requestClient({ token }).get(
      `/account/notifications`
      );

      if (response.status === 200) {
        const datal = response.data?.data?.data?.slice(0,5);
        setNotifications(datal || []);
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchingData();
    }
  }, [token]);

  return (
    <Box className="lg:fixed w-full bg-white z-50 border-b-[2px] max-w-screen-2xl mx-auto">
      {/* Mobile View */}

      <Box
        className="flex justify-between shadow-sm lg:pr-8 items-center h-16 px-6"
        display={{ base: "flex", md: "none" }}
      >
        {/* Logo */}
        <HStack onClick={() => router.push("/storefront")} cursor="pointer">
          <Image
            src={Logo}
            alt="10mg Health Logo"
            className="w-20 h-20"
            width={40}
            height={40}
          />
        </HStack>

        {/* Navigation Icons */}
        <HStack spacing={4} color="primary.500">
          {/* Search Icon */}
          <Box
            cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
            onClick={!isRestrictedStatus ? handleOpenSearch : undefined}
            opacity={isRestrictedStatus ? 0.5 : 1}
          >
            <Stack align="center">
              <Icon as={Search} boxSize={5} />
            </Stack>
          </Box>

          {/* Cart Icon */}
          <Box
            cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
            onClick={!isRestrictedStatus ? handleOpenCart : undefined}
            opacity={isRestrictedStatus ? 0.5 : 1}
          >
            <Stack align="center">
              <Box position="relative" display="flex" alignItems="center">
                <Icon as={PiShoppingBagBold} boxSize={5} />
                <Box
                  as="span"
                  position="absolute"
                  top="-1"
                  right="-2"
                  bg="red.600"
                  color="white"
                  fontSize="xs"
                  px={1}
                  borderRadius="full"
                >
                  {cartSize}
                </Box>
              </Box>
            </Stack>
          </Box>
          {/* Avatar Icon */}
          <Box cursor="pointer">
            <Stack align="center">
              <Box position="relative" display="flex" alignItems="center">
                <Icon as={UserCircle2Icon} boxSize={5} color="primary.500" />
              </Box>
            </Stack>
          </Box>

          {/* Mobile Dropdown Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Menu"
              icon={<RxHamburgerMenu />}
              variant="ghost"
              fontSize="2xl"
            />
            <MenuList
              bg="white"
              w="100vw"
              p={2}
              m={0}
              borderRadius={0}
              color="gray.900"
              fontSize="md"
              fontWeight="medium"
            >
              {/* Menu Items */}
              <MenuItem py={3}>
                <Text cursor="pointer">
                  <Link href={"/storefront/settings"}>
                    Personal Information
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem
                py={3}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={isRestrictedStatus ? undefined : () => router.push("/storefront/orders")}
              >
                <Text>My Orders</Text>
              </MenuItem>
              <MenuItem
                py={3}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={isRestrictedStatus ? undefined : () => router.push("/storefront/my-wishlist")}
              >
                <Text>My Wishlist</Text>
              </MenuItem>
              <MenuItem
                py={3}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={isRestrictedStatus ? undefined : () => router.push("/storefront/shopping-list")}
              >
                <Text>Shopping List</Text>
              </MenuItem>
              <MenuItem
                py={3}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={isRestrictedStatus ? undefined : () => router.push("/product-reviews")}
              >
                <Text>Product Reviews</Text>
              </MenuItem>
              <MenuItem
                py={3}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                // onClick={isRestrictedStatus ? undefined : () => router.push("/help")}
                onClick={() => router.push("/storefront/faq")}
              >
                <Text>Help</Text>
              </MenuItem>
              <Box py={3}>
                <Button
                  colorScheme="primary"
                  width="full"
                  mt={2}
                  onClick={async () => await signOut()}
                >
                  Log Out
                </Button>
              </Box>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {/* Desktop View */}
      <Box
        className="flex justify-between shadow-sm items-center px-20 "
        display={{ base: "none", md: "flex" }}
      >
        {/* Logo */}
        <HStack className="h-16 my-4" onClick={() => router.push("/storefront")} cursor="pointer">
          <Image
            src={Logo}
            alt="10mg Health Logo"
            className="w-[160px] md:h-auto"
            width={75}
            height={75}
          />
        </HStack>

        {/* Navigation */}
        <HStack
          spacing={8}
          color="primary.500"
          fontSize="sm"
          fontWeight="medium"
          alignItems="center"
        >
          {/* Search */}
          <Box
            cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
            onClick={!isRestrictedStatus ? handleOpenSearch : undefined}
            opacity={isRestrictedStatus ? 0.5 : 1}
          >
            <Stack align="center" spacing={1}>
              <Icon as={Search} boxSize={5} /> <Text>Search</Text>
            </Stack>
          </Box>

          {/* NOTIFICATIONS */}
          <Menu>
            <MenuButton className="relative">
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6 mx-auto" />
              <div className="px-1 rounded-full bg-red-500 absolute top-0 right-6 text-[9px] text-white">1</div>
              <Text>Notifications</Text>
            </MenuButton>
            <MenuList
              bg="white"
              w="410px"
              m={0}
              rounded="xl"
              color="gray.900"
              fontSize="md"
              fontWeight="medium"
              h="560px"
              overflowY={"scroll"}
              sx={{
                "::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none"
              }}
            >
              <div>
                <div className="flex items-center justify-between px-5">
                  <p className='font-bold text-lg'>Notifications</p>
                  <div
                  onClick={() => router.push('/storefront/notifications')}
                    className='text-sm font-semibold cursor-pointer text-primary-600'
                  >
                    View all
                  </div>
                </div>
              {
                loading ? 
                  <Flex justify="center" align="center" height="200px">
                      <Spinner size="xl" />
                  </Flex>
                : 
                notifications?.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-24 text-center">
                  <IoIosNotifications
                    className="w-32 h-32 text-primary-500"
                  />
                  <p className="text-gray-600 font-medium mt-4">
                  This is where your notifications will appear.
                  </p>
                </div>
                )
                : (
                <div className="mt-6">
                  {notifications?.map((notification) => (
                    <MenuItem key={notification?.id} display={"block"} _hover={{bg: "none"}}>
                      <Link
                        href={`/storefront/notifications?id=${notification.id}`}
                        className="flex border-b border-gray-200 cursor-pointer pb-2"
                      >
                        <div className='flex gap-3'>
                          <div>
                            <div className="p-1 bg-blue-100 text-blue-600 rounded-full">
                              <IoMdNotificationsOutline
                                className="w-6 h-6 cursor-pointer"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                              <p 
                              className={cn(notification.readAt ? "text-black/50 font-normal" : "text-[#101828]" , "font-medium text-sm leading-6")}>{
                              notification?.data?.subject}
                              </p>
                              <p className="text-sm text-gray-400">{notification?.createdAt}</p>
                          </div>
                        </div>
                      </Link>
                    </MenuItem>
                  ))}
                </div>
                )
              }
            </div>
            </MenuList>
          </Menu>

          {/* Cart */}
          <Box
            cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
            onClick={!isRestrictedStatus ? handleOpenCart : undefined}
            opacity={isRestrictedStatus ? 0.5 : 1}
          >
            <Stack align="center" spacing={1}>
              <Box position="relative" display="flex" alignItems="center">
                <Icon as={PiShoppingBagBold} boxSize={5} />{" "}
                <Box
                  as="span"
                  position="absolute"
                  top="-1"
                  right="-2"
                  bg="red.600"
                  color="white"
                  fontSize="xs"
                  px={1}
                  borderRadius="full"
                >
                  {cartSize}
                </Box>
              </Box>
              <Text>Cart</Text>
            </Stack>
          </Box>

          {/* FAQs */}
          <Box
            cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
            // onClick={!isRestrictedStatus ? () => router.push("/faq") : undefined}
            onClick={() => router.push("/storefront/faq")}
            opacity={isRestrictedStatus ? 0.5 : 1}
          >
            <Stack align="center" spacing={1} >
              <Icon as={FaRegCircleQuestion} boxSize={5} />
              <Text>FAQs</Text>
            </Stack>
          </Box>

          {/* Account */}
          <Menu>
            <MenuButton as="button">
              <Stack align="center" spacing={1}>
                <Avatar
                  size="sm"
                  name={userData?.user?.name}
                  src={userData?.user?.picture}
                />
                <Text>Account</Text>
              </Stack>
            </MenuButton>
            <MenuList
              bg="white"
              w="280px"
              m={0}
              rounded="xl"
              color="gray.900"
              fontSize="md"
              fontWeight="medium"
            >
              <Box borderBottomWidth="thin" px={4} py={3}>
                <HStack spacing={4}>
                  <Avatar
                    size="md"
                    name={userData?.user?.name}
                    src={userData?.user?.picture}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium" fontSize="md">
                      {userData?.user?.name
                        ? userData?.user?.name
                        : "Bubbles Pharmacy"}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {userData?.user?.email
                        ? userData?.user?.email
                        : "hello@bubbles.com"}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
              <MenuItem py={3} px={4}>
                <Text cursor="pointer">
                  <Link href={"/storefront/settings"}>
                    Personal Information
                  </Link>
                </Text>
              </MenuItem>
              <MenuItem
                py={3}
                px={4}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={isRestrictedStatus ? undefined : () => router.push("/storefront/orders")}
              >
                <Text>My Orders</Text>
              </MenuItem>
              <MenuItem
                py={3}
                px={4}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={isRestrictedStatus ? undefined : () => router.push("/storefront/my-wishlist")}
              >
                <Text>My Wishlist</Text>
              </MenuItem>
              <MenuItem
                py={3}
                px={4}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={isRestrictedStatus ? undefined : () => router.push("/storefront/shopping-list")}
              >
                <Text>Shopping List</Text>
              </MenuItem>
              <MenuItem
                py={3}
                px={4}
                color="error.500"
                borderTopWidth="thin"
                onClick={async () => await signOut()}
              >
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {/* Search Modal */}
      <SearchModal
        isSearchOpen={isSearchOpen}
        handleCloseSearch={handleCloseSearch}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        isRemoveOpen={isRemoveOpen}
        handleOpenRemove={handleOpenRemove}
        handleCloseRemove={handleCloseRemove}
      />
    </Box>
  );
};

export default Navbar;
