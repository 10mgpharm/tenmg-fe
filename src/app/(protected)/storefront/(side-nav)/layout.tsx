"use client";
import React from "react";
import BreadCrumbBanner from "../_components/BreadCrumbBanner";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BusinessStatus } from "@/constants";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";

export default function VendorSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  // console.log("pathname", pathname);
  const activeIndex = link_arr.findIndex((link) =>
    pathname.startsWith(link.href)
  );
  // console.log("activeIndex", activeIndex);

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
    <div className="">
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <div className="grid grid-cols-1 lg:grid-cols-6 w-11/12 mx-auto gap-5 h-full">
        <div className="col-span-1 border-x-gray-200 border-x flex flex-col ">
          {link_arr.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className={`text-sm p-4 text-gray-700 ${activeIndex === i ? "bg-primary-50 font-semibold" : null
                }`}
              style={{
                pointerEvents: isRestrictedStatus && link.label !== "Personal Information" ? 'none' : 'auto',
                color: isRestrictedStatus && link.label !== "Personal Information" ? 'gray' : 'inherit',
                opacity: isRestrictedStatus && link.label !== "Personal Information" ? 0.6 : 1,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="col-span-5">{children}</div>
      </div>
    </div>
  );
}
