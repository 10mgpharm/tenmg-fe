"use client";

import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
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
import { useCallback, useState } from "react";
import NotificationModal from "./NotificationModal";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";

const TopNavBar = ({ route }: { route: string }) => {

  const router = useRouter();
  const session = useSession();
  const data = session.data as NextAuthUserSession;

  const renderBusinessType = (businessType: string) => {
    switch (businessType) {
      case "VENDOR":
        return (
          <Tag
            size="sm"
            ml="1"
            borderRadius={"full"}
            color={"green.500"}
            bgColor={"green.50"}
          >
            <TagLabel>{convertLetterCase(businessType)}</TagLabel>
          </Tag>
        );
      case "SUPPLIER":
        return (
          <Tag size="sm" variant="solid" bg="green.50" color={"green.500"}>
            {convertLetterCase(businessType)}
          </Tag>
        );
      case "ADMIN":
        return (
          <Tag size="sm" variant="solid" bg={"#E8F1F8"} textColor={"blue.700"}>
            {convertLetterCase(businessType)}
          </Tag>
        );
      case "LENDER":
        return (
          <Tag size="sm" variant="solid" bg="blue.50" color={"blue.700"}>
            {convertLetterCase(businessType)}
          </Tag>
        );
      default:
        return (
          <Tag size="sm" variant="solid" colorScheme="red">
            {businessType?.toLocaleLowerCase()}
          </Tag>
        );
    }
  };

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;

  const fetchingData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestClient({ token }).get(
        `/account/notifications`
      );

      if (response.status === 200) {
        const datal = response.data?.data?.data?.slice(0,5);
        setNotifications(datal || []);
      }
    } catch (err: any) {
      console.error(err);
      toast(handleServerErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="lg:fixed w-full bg-white z-50">
      <div className="flex justify-between shadow-sm lg:pr-8">
        <div className="flex items-center gap-8 md:gap-36">
          <div className="hidden md:flex h-16 shrink-0 items-center my-4 ml-6 md:ml-12">
            <Image
              src={Logo}
              alt=""
              className="w-24 h-10 md:w-[160px] md:h-auto"
              width={75}
              height={75}
            />
          </div>
          <GreetingComponent />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {data?.user?.entityType === "VENDOR" && (
            <FormControl display="flex" alignItems="center" w={"auto"} gap={2}>
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
          <Menu as="div">
            <MenuButton
              type="button"
              onClick={fetchingData}
              className="-m-2.5 relative p-2.5 text-primary-600 rounded-full bg-primary-50 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <div className="px-1 rounded-full bg-red-500 absolute top-2 right-2 text-[9px] text-white">1</div>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </MenuButton>
            <NotificationModal
              notificationsMsgs={notifications}
              route={route}
              loading={loading}
            />
          </Menu>
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <Avatar
                size="md"
                name={data?.user?.name}
                src={data?.user?.picture}
              />
              <span className="hidden lg:flex lg:items-center">
                <div className="text-left ml-4">
                  <div className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      {data?.user.name}
                    </span>
                    {renderBusinessType(data?.user?.entityType)}
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
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <MenuItem>
                <button
                  className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                  onClick={() => {
                    if (data?.user?.entityType === "SUPPLIER") {
                      router.push("/suppliers/settings/personal_information");
                    } else if (data?.user?.entityType === "VENDOR") {
                      router.push("/vendors/settings/general_settings");
                    } else if (data?.user?.entityType === "ADMIN") {
                      router.push("/admin/settings/general_settings");
                    } else if (data?.user?.entityType === "LENDER") {
                      router.push("/lenders/settings/general-settings");
                    } else {
                      router.push("/"); // Fallback route if no entity type matches
                    }
                  }}
                >
                  View Profile
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  className="block px-3 py-1 text-sm leading-6 text-red-600 data-[focus]:bg-red-50"
                  onClick={async () => {
                    await signOut();
                    router.push("/");
                  }}
                >
                  Log Out
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
      {/* <Divider /> */}
    </div>
  );
};

export default TopNavBar;
