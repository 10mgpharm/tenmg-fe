import React from 'react'
import BreadCrumbBanner from '../BreadCrumbBanner'

interface BreadcrumbItem {
  text: string;
  link: string;
}

interface StorefrontSettingsLayoutProps {
  children: React.ReactNode,
  breadCrumb: BreadcrumbItem[]
}
export default function StorefrontSettingsLayout({ children, breadCrumb }: StorefrontSettingsLayoutProps) {

  const arr = [
    "Personal Information",
    "My Orders",
    "My Wishlist",
    "Shopping List",
    "Product Review",
  ]

  return (
    <section>
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      <div className='grid grid-cols-1 lg:grid-cols-6 w-11/12 mx-auto gap-5 h-full'>
        <div className='col-span-1 border-x-gray-500 border-x '>
          {arr.map((i) => (
            <p key={i} className='text-sm p-4 text-gray-700'>{i}</p>
          ))}
        </div>


        <div className='col-span-5'>{children}</div>
      </div>
    </section>
  )
}
