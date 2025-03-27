"use client";
import React, { useState } from "react";
import BreadCrumbBanner from "../../_components/BreadCrumbBanner";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { BusinessStatus } from "@/constants";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import Navbar from "../../_components/Navbar";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";

export default function VendorSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [openMobileSideBar, setOpenMobileSideBar] = useState(false);
  const link_arr = [
    {
      label: "Personal Information",
      href: "/storefront/settings/profile-information",
    },
    { label: "My Orders", href: "/storefront/orders/my-orders" },
    { label: "My Wishlist", href: "/storefront/my-wishlist" },
    { label: "Shopping List", href: "/storefront/shopping-list" },
    { label: "Product Review", href: "/storefront/reviews/pending-reviews" },
  ];

  // /storefront/shopping-list
  const pathname = usePathname();

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const businessStatus = userData?.user?.businessStatus;

  const activeIndex = link_arr.findIndex((link) =>
    pathname.startsWith(link.href)
  );

  const isRestrictedStatus = [
    BusinessStatus.PENDING_VERIFICATION,
    BusinessStatus.PENDING_APPROVAL,
    BusinessStatus.REJECTED,
    BusinessStatus.LICENSE_EXPIRED,
    BusinessStatus.SUSPENDED,
    BusinessStatus.BANNED,
  ].includes(businessStatus);

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
      text: link_arr[activeIndex]?.label,
      link: "#",
    },
  ];

  return (
    <>
      <div className="">
        <Navbar OpenMenu={setOpenMobileSideBar} />
        <BreadCrumbBanner breadCrumbsData={breadCrumb} />
        <div className="grid grid-cols-1 lg:grid-cols-6 w-11/12 mx-auto gap-5 h-full">
          <div className="sticky top-[100px] h-screen hidden lg:flex col-span-1 border-x-gray-200 border-x flex-col ">
            {link_arr.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={`text-sm p-4 text-gray-700 ${
                  activeIndex === i ? "bg-primary-50 font-semibold" : null
                }`}
                style={{
                  pointerEvents:
                    isRestrictedStatus && link.label !== "Personal Information"
                      ? "none"
                      : "auto",
                  color:
                    isRestrictedStatus && link.label !== "Personal Information"
                      ? "gray"
                      : "inherit",
                  opacity:
                    isRestrictedStatus && link.label !== "Personal Information"
                      ? 0.6
                      : 1,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="col-span-full lg:col-span-5">{children}</div>
        </div>
      </div>

      {openMobileSideBar && (
        <MobileSideBar
          link_arr={link_arr}
          isOpen={openMobileSideBar}
          setIsOpen={setOpenMobileSideBar}
          activeIndex={activeIndex}
          isRestrictedStatus={isRestrictedStatus}
        />
      )}
    </>
  );
}

const MobileSideBar = ({
  link_arr,
  isOpen,
  setIsOpen,
  activeIndex,
  isRestrictedStatus,
}: {
  link_arr: {
    label: string;
    href: string;
  }[];
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  activeIndex: number;
  isRestrictedStatus: boolean;
}) => {
  const route = useRouter();
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        setIsOpen(false);
      }}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent className="!p-0">
        <DrawerCloseButton />
        <DrawerBody className="!p-0">
          <div className="col-span-1 border-x-gray-200 border-x flex flex-col ">
            {link_arr.map((link, i) => (
              <p
                key={i}
                onClick={() => {
                  route.push(link.href);
                  setIsOpen(false);
                }}
                className={`text-sm p-4 cursor-pointer text-gray-700 ${
                  activeIndex === i ? "bg-primary-50 font-semibold" : null
                }`}
                style={{
                  pointerEvents:
                    isRestrictedStatus && link.label !== "Personal Information"
                      ? "none"
                      : "auto",
                  color:
                    isRestrictedStatus && link.label !== "Personal Information"
                      ? "gray"
                      : "inherit",
                  opacity:
                    isRestrictedStatus && link.label !== "Personal Information"
                      ? 0.6
                      : 1,
                }}
              >
                {link.label}
              </p>
            ))}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
