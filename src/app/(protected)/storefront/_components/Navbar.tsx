"use client";

import { useCallback, useEffect, useState } from "react";
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
  Avatar,
  Flex,
  Spinner,
} from "@chakra-ui/react";

import { BellIcon, Search } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter, useSearchParams } from "next/navigation";
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
import { requestPermission } from "@/lib/requestPermission";
import { toast } from "react-toastify";
import { messaging, onMessage } from "@/lib/firebase";
import { handleServerErrorMessage } from "@/utils";
import PaymentStatusBanner from "./PaymentStatusBanner";

const Navbar = ({ OpenMenu }: { OpenMenu?: (value: boolean) => void }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notificationCount, setNotificationCount] = useState<number>(0);

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

  const fetchingCounts = useCallback(async () => {
    const res = await requestClient({ token: token }).get(
      `/account/count-unread-notifications`
    )
    setNotificationCount(res.data?.data?.count)
  }, [token]);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(function (swReg) {
          console.log('Service Worker is registered', swReg);
        })
        .catch(function (error) {
          console.error('Service Worker registration failed:', error);
        });
    } else {
      console.warn('Push messaging is not supported');
    }
  }, []);

  useEffect(() => {
    if ("Notification" in window && token) {
      requestPermission(token);
    }
    if (token) {
      fetchingCounts();
    }
  }, [token, fetchingCounts]);

  useEffect(() => {
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        fetchingCounts();
        toast(`🦄 ${payload.notification.body}!`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
      return () => unsubscribe();
    }
  }, [messaging, token]);

  const markAsRead = async (id: string) => {
    try {
      const res = await requestClient({ token: token }).patch(
        `/account/notifications/${id}`,
      );
      if (res.status === 200) {
        fetchingCounts();
      }
    } catch (error) {
      console.error(error);
      toast.error(handleServerErrorMessage(error));
    }
  }

  const routeNotification = async (url: string, id: string) => {
    await markAsRead(id);
    router.push(url);
  }

  return (
    <Box className="fixed top-0 left-0 right-0 w-full bg-white z-50 border-b-[2px] max-w-screen-2xl mx-auto">
       <PaymentStatusBanner />
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
            className="w-[160px] md:h-auto "
            width={75}
            height={75}
          />

          {/* for mobile
          <Image
            src={LogoSymbol}
            alt="10mg Health Logo"
            className="w-10 h-10 block md:hidden"
            width={25}
            height={25}
          /> */}
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
            <MenuButton
              type="button"
              onClick={fetchingData}
              className="relative">
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6 mx-auto" />
              <div className="px-1 rounded-full bg-red-500 absolute top-0 right-0 md:right-6 text-[9px] text-white">{notificationCount}</div>
              <Text className=" hidden md:block">Notifications</Text>
            </MenuButton>
            <MenuList
              bg="white"
              w="410px"
              m={0}
              rounded="xl"
              color="gray.900"
              fontSize="md"
              fontWeight="medium"
              // h="560px"
              overflowY={"scroll"}
              sx={{
                "::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
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
                            <MenuItem key={notification?.id} display={"block"} _hover={{ bg: "none" }}>
                              <div
                                onClick={() => routeNotification(`/storefront/notifications?id=${notification.id}`, notification?.id)}
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
                                      className={cn(notification.readAt ? "text-black/50 font-normal" : "text-[#101828]", "font-medium text-sm leading-6")}>{
                                        notification?.data?.subject}
                                    </p>
                                    <p className="text-sm text-gray-400">{notification?.createdAt}</p>
                                  </div>
                                </div>
                              </div>
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

                <div className="px-1 rounded-full bg-red-500 absolute top-[-2px] right-[-5px] text-[9px] text-white">{cartSize}</div>
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
