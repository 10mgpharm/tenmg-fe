'use client';
import React from 'react'
import BreadCrumbBanner from '../_components/BreadCrumbBanner';
import { usePathname } from 'next/navigation';



export default function VendorSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const arr = [
    // !TODO: make this array into an object where the key is the label and the value is the link that way I can compare the pathname to the link and apply the active class
    "Personal Information",
    "My Orders",
    "My Wishlist",
    "Shopping List",
    "Product Review",
  ]

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
      text: "Vaccines",
      link: "#"
    }
  ]

  // const pathname = usePathname();

  return (

    <div className="">
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <div className="grid grid-cols-1 lg:grid-cols-6 w-11/12 mx-auto gap-5 h-full">
        <div className='col-span-1 border-x-gray-500 border-x '>
          {arr.map((i) => (
            <p key={i} className='text-sm p-4 text-gray-700'>{i}</p>
          ))}
        </div>
        <div className='col-span-5'>{children}</div>
      </div>
    </div>

  )
}
