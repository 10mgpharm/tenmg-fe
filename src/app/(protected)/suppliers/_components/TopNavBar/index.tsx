"use client";

import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { BellIcon } from "@heroicons/react/24/outline";
import Logo from "@public/assets/images/10mg logo.svg";
import { signOut, useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import {
  Avatar,
  FormControl,
  FormLabel,
  Switch,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { convertLetterCase, handleServerErrorMessage } from "@/utils";
import GreetingComponent from "./GreetingComponent";
import { useCallback, useEffect, useState } from "react";
import NotificationModal from "./NotificationModal";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { messaging, onMessage } from "@/lib/firebase";
import { requestPermission } from "@/lib/requestPermission";

const TopNavBar = ({
  route,
  onMenuClick,
}: {
  route: string;
  onMenuClick?: () => void;
}) => {
  const router = useRouter();
  const session = useSession();
  const data = session.data as NextAuthUserSession;
  const token = data?.user?.token;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchingCounts = useCallback(async () => {
    const res = await requestClient({ token }).get(
      `/account/count-unread-notifications`
    );
    setNotificationCount(res.data?.data?.count);
  }, [token]);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((swReg) => {
          console.log("Service Worker is registered", swReg);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    } else {
      console.warn("Push messaging is not supported");
    }
  }, []);

  useEffect(() => {
    if ("Notification" in window && token) {
      requestPermission(token);
    }
    if (!token) return;
    fetchingCounts();
  }, [token]);

  useEffect(() => {
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        fetchingCounts();
        toast(`🦄 ${payload.notification.body}!`, {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
      });
      return () => unsubscribe();
    }
  }, [messaging]);

  const fetchingData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(
        `/account/notifications`
      );
      if (response.status === 200) {
        const datal = response.data?.data?.data;
        const unreadResponses = datal
          ?.filter((e: any) => e.readAt === null)
          ?.slice(0, 5);
        setNotifications(unreadResponses || []);
      }
    } catch (err: any) {
      console.error(err);
      toast(handleServerErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  // const renderBusinessType = (businessType: string) => {
  //   switch (businessType) {
  //     case "VENDOR":
  //       return (
  //         <Tag size="sm" borderRadius="full" color="green.500" bg="green.50">
  //           <TagLabel>{convertLetterCase(businessType)}</TagLabel>
  //         </Tag>
  //       );
  //     case "SUPPLIER":
  //       return (
  //         <Tag size="sm" variant="solid" bg={"#E8F1F8"} textColor={"blue.700"}>
  //           {convertLetterCase(businessType)}
  //         </Tag>
  //       );
  //     case "ADMIN":
  //       return (
  //         <Tag size="sm" variant="solid" bg="#0000" color="red.700">
  //           {convertLetterCase(businessType)}
  //         </Tag>
  //       );
  //     case "LENDER":
  //       return (
  //         <Tag size="sm" variant="solid" bg="blue.50" color="blue.700">
  //           {convertLetterCase(businessType)}1
  //         </Tag>
  //       );
  //     default:
  //       return (
  //         <Tag size="sm" variant="solid" colorScheme="red">
  //           {businessType?.toLowerCase()}
  //         </Tag>
  //       );
  //   }
  // };

  const renderUserRole = (role?: string, entityType?: string) => {
    if (!role || !entityType) return null;

    const entity = entityType.trim().toLowerCase();
    const normalizedRole = role.trim().toLowerCase();

    const capitalizeWords = (text: string) =>
      text
        .split(/[_\s]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    let roleDisplay = "";

    if (entity === "vendor") {
      switch (normalizedRole) {
        case "vendor":
          roleDisplay = "Vendor Admin";
          break;
        case "supporter":
          roleDisplay = "Vendor Support";
          break;
        case "operator":
          roleDisplay = "Vendor Operator";
          break;
        default:
          roleDisplay = `Vendor ${capitalizeWords(normalizedRole)}`;
      }
    } else if (entity === "supplier") {
      roleDisplay = "Supplier";
    } else if (entity === "lender") {
      roleDisplay = "Lender";
    } else if (entity === "admin") {
      roleDisplay = `10mg ${capitalizeWords(normalizedRole)}`;
    } else {
      roleDisplay = capitalizeWords(role);
    }

    return roleDisplay;
  };

  return (
    <div className="lg:fixed w-full bg-white z-50">
      <div className="flex justify-between shadow-sm lg:pr-8">
        <div className="flex items-center gap-8 md:gap-36">
          <div className="hidden md:flex h-16 shrink-0 items-center my-4 ml-6 md:ml-12">
            <Image
              src={Logo}
              alt="Logo"
              className="w-24 h-10 md:w-[160px] md:h-auto"
              width={75}
              height={75}
            />
          </div>
          <GreetingComponent />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {data?.user?.entityType === "VENDOR" && (
            <FormControl display="flex" alignItems="center" w="auto" gap={2}>
              <Switch id="test-mode" />
              <FormLabel
                htmlFor="test-mode"
                mb="0"
                color="error.700"
                fontSize={{ base: "xs", md: "sm" }}
              >
                Test Mode
              </FormLabel>
            </FormControl>
          )}

          {/* Notification bell */}
          <Menu as="div">
            <MenuButton
              type="button"
              onClick={fetchingData}
              className="-m-2.5 relative p-2.5 text-primary-600 rounded-full bg-primary-50 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <div className="px-1 rounded-full bg-red-500 absolute top-2 right-2 text-[9px] text-white">
                {notificationCount}
              </div>
              <BellIcon className="h-8 w-8" />
            </MenuButton>
            <NotificationModal
              notificationsMsgs={notifications}
              route={route}
              loading={loading}
              token={token}
              fetchingCounts={fetchingCounts}
            />
          </Menu>

          {/* User Avatar and dropdown */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center p-1.5">
              <Avatar
                size="md"
                name={data?.user?.name}
                src={data?.user?.picture}
              />
              <span className="hidden lg:flex lg:items-center">
                <div className="text-left ml-4">
                  <div className="flex gap-2 items-center">
                    <span
                      aria-hidden="true"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      {data?.user.name}
                    </span>
                    <Tag
                      size="sm"
                      variant="solid"
                      bg="green.100"
                      color="green.700"
                    >
                      {renderUserRole(data?.user?.role, data?.user?.entityType)}
                    </Tag>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {data?.user?.businessName}
                  </p>
                </div>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="ml-4 h-6 w-6 text-gray-600"
                />
              </span>
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition">
              <MenuItem>
                <button
                  className="block px-3 py-1 text-sm text-gray-900 hover:bg-gray-50 w-full text-left"
                  onClick={() => {
                    const type = data?.user?.entityType;
                    const routes: Record<string, string> = {
                      SUPPLIER: "/suppliers/settings/personal_information",
                      VENDOR: "/vendors/settings/general_settings",
                      ADMIN: "/admin/settings/general_settings",
                      LENDER: "/lenders/settings/general-settings",
                    };
                    router.push(routes[type] || "/");
                  }}
                >
                  View Profile
                </button>
              </MenuItem>

              <MenuItem>
                <button
                  className="block px-3 py-1 text-sm text-gray-900 hover:bg-gray-50 w-full text-left"
                  onClick={() => {
                    const type = data?.user?.entityType;
                    const faqRoutes: Record<string, string> = {
                      SUPPLIER: "/suppliers/faq",
                      VENDOR: "/vendors/faq",
                      ADMIN: "/admin/faq",
                      LENDER: "/lenders/faq",
                    };
                    router.push(faqRoutes[type] || "/faq");
                  }}
                >
                  FAQ
                </button>
              </MenuItem>
              
              <MenuItem>
                <button
                  className="block px-3 py-1 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  onClick={async () => {
                    await signOut();
                    router.push("/auth/signin");
                  }}
                >
                  Log Out
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>

          {(data?.user?.entityType === "ADMIN" ||
            data?.user?.entityType === "SUPPLIER" ||
            data?.user?.entityType === "VENDOR") && (
            <div
              className="lg:hidden p-2 text-gray-700 w-fit"
              onClick={onMenuClick}
            >
              <Bars3Icon className="w-6" />
              <span className="sr-only">Open sidebar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
