'use client';
import React from 'react'
import BreadCrumbBanner from '../_components/BreadCrumbBanner';
import { usePathname } from 'next/navigation';
import Link from 'next/link';



export default function VendorSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const arr = [
    // !TODO: make this array into an object where the key is the label and the value is the link that way I can compare the pathname to the link and apply the active class
    "Personal Information",
    "",
    "",
    "",
    "",
  ]

  const link_arr = [
    { label: "Personal Information", href: '/storefront/settings/profile-information' },
    { label: 'My Orders', href: '/storefront/orders/my-orders' },
    { label: 'My Wishlist', href: '/storefront/my-wishlist' },
    { label: 'Shopping List', href: '/storefront/shopping-list' },
    { label: 'Product Review', href: '/storefront/reviews/pending-reviews' },
  ];

  // /storefront/shopping-list
  const pathname = usePathname();

  // console.log("pathname", pathname);
  const activeIndex = link_arr.findIndex((link) => pathname.startsWith(link.href));
  console.log("activeIndex", activeIndex);


  const breadCrumb = [
    {
      text: "Home",
      link: "/"
    },
    {
      text: "Products",
      link: "/storefront"
    },
    {
      text: link_arr[activeIndex]?.label,
      link: "#"
    }
  ]





  return (

    <div className="">
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <div className="grid grid-cols-1 lg:grid-cols-6 w-11/12 mx-auto gap-5 h-full">
        <div className='col-span-1 border-x-gray-500 border-x flex flex-col '>
          {link_arr.map((link, i) => (
            <Link key={i} href={link.href} className={`text-sm p-4 text-gray-700 ${activeIndex === i ? 'bg-primary-50 font-semibold' : null}`}>{link.label}</Link>
          ))}
        </div>
        <div className='col-span-5'>{children}</div>
      </div>
    </div>

  )
}
