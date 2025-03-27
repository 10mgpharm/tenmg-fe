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
import LogoSymbol from "@public/assets/images/logo-sign.png";
import { PiShoppingBagBold } from "react-icons/pi";
import { FaRegCircleQuestion } from "react-icons/fa6";
import CartDrawer from "./CartDrawer";
import SearchModal from "./SearchModal";
import Link from "next/link";
import { useCartStore } from "../(NoSideMenu)/storeFrontState/useCartStore";
import { NextAuthUserSession } from "@/types";
import { BusinessStatus } from "@/constants";
import requestClient from "@/lib/requestClient";
import { IoIosNotifications, IoMdNotificationsOutline } from "react-icons/io";
import { cn } from "@/lib/utils";
import NotificationDropDown from "./NotificationDropDown";

const Navbar = ({ OpenMenu }: { OpenMenu?: (value: boolean) => void }) => {
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

  // const [cartDataCount, setCartDataCount] = useState(null);
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
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(
        `/account/notifications`
      );
      if (response.status === 200) {
        const datal = response.data?.data?.data?.slice(0, 5);
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
    <Box className="fixed top-0 left-0 right-0 w-full bg-white z-50 border-b-[2px] max-w-screen-2xl mx-auto">
      {/* Desktop View */}
      <Box
        className="flex justify-between shadow-sm items-center container py-[20px]"
        display={{ base: "flex", md: "flex" }}
      >
        {/* Logo */}
        <HStack
          // className="h-16 my-4"
          onClick={() => router.push("/storefront")}
          cursor="pointer"
        >
          {/* for desktop  */}
          <Image
            src={Logo}
            alt="10mg Health Logo"
            className="w-[160px] md:h-auto hidden md:block"
            width={75}
            height={75}
          />

          {/* for mobile */}
          <Image
            src={LogoSymbol}
            alt="10mg Health Logo"
            className="w-10 h-10 block md:hidden"
            width={25}
            height={25}
          />
        </HStack>

        {/* Navigation */}
        <HStack
          // spacing={8}
          color="primary.500"
          fontSize="sm"
          fontWeight="medium"
          alignItems="center"
          className="space-x-4  md:space-x-8"
        >
          {/* Search */}
          <Box
            cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
            onClick={!isRestrictedStatus ? handleOpenSearch : undefined}
            opacity={isRestrictedStatus ? 0.5 : 1}
          >
            <Stack align="center" spacing={1}>
              <Icon as={Search} boxSize={5} />{" "}
              <Text className="hidden md:block">Search</Text>
            </Stack>
          </Box>

          {/* NOTIFICATIONS */}
          <Menu>
            <MenuButton className="relative">
              <Box className=" flex flex-col justify-center  ">
                <BellIcon aria-hidden="true" className="h-6 w-6 mx-auto" />
                <Box
                  as="span"
                  position="absolute"
                  top="-2"
                  bg="red.600"
                  color="white"
                  fontSize="xs"
                  px={1}
                  width={4}
                  height={4}
                  borderRadius="full"
                  className="flex items-center justify-center -right-2  md:right-[22px] "
                >
                  {1}
                </Box>
              </Box>
              <Text className="hidden md:block">Notifications</Text>

              {/* <div className="px-1 rounded-full bg-red-500 absolute top-0 right-6 text-[9px] text-white">
                1
              </div> */}
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
                "scrollbar-width": "none",
              }}
            >
              <NotificationDropDown
                notifications={notifications}
                loading={loading}
              />
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
                  top="-2"
                  right="-3"
                  bg="red.600"
                  color="white"
                  fontSize="xs"
                  px={1}
                  width={4}
                  height={4}
                  borderRadius="full"
                  className="flex items-center justify-center"
                >
                  {cartSize}
                </Box>
              </Box>
              <Text className="hidden md:block">Cart</Text>
            </Stack>
          </Box>

          {/* FAQs */}
          <Box
            cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
            onClick={() => router.push("/storefront/faq")}
            opacity={isRestrictedStatus ? 0.5 : 1}
            className="hidden md:block"
          >
            <Stack align="center" spacing={1}>
              <Icon as={FaRegCircleQuestion} boxSize={5} />
              <Text className="hidden md:block">FAQs</Text>
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
                <Text className="hidden md:block">Account</Text>
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
                onClick={
                  isRestrictedStatus
                    ? undefined
                    : () => router.push("/storefront/orders")
                }
              >
                <Text>My Orders</Text>
              </MenuItem>
              <MenuItem
                py={3}
                px={4}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={
                  isRestrictedStatus
                    ? undefined
                    : () => router.push("/storefront/my-wishlist")
                }
              >
                <Text>My Wishlist</Text>
              </MenuItem>
              <MenuItem
                py={3}
                px={4}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={
                  isRestrictedStatus
                    ? undefined
                    : () => router.push("/storefront/shopping-list")
                }
              >
                <Text>Shopping List</Text>
              </MenuItem>

              <MenuItem
                py={3}
                px={4}
                opacity={isRestrictedStatus ? 0.5 : 1}
                cursor={isRestrictedStatus ? "not-allowed" : "pointer"}
                onClick={() => router.push("/storefront/faq")}
                className="block md:hidden"
              >
                <Text>Help</Text>
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

          {/* MenuIcon */}
          {OpenMenu && (
            <Box onClick={() => OpenMenu(true)} className="cursor-pointer">
              <RxHamburgerMenu size={23} className="block lg:hidden" />
            </Box>
          )}
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
