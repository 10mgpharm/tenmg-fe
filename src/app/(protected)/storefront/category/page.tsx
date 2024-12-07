'use client'
import React from 'react'
import StoreProductCardComponent from '../components/StoreProductCardComponent'
import EmptyProductScreen from '../components/EmptyProductScreen'
import BreadCrumbBanner from '../components/BreadCrumbBanner'

export default function StoreFrontByCategory() {

  const breadCrumb = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Products',
      link: '/storefront'
    },
    {
      text: 'Vaccines',
      link: '#'
    }
  ]

  return (
    <section className="">
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      {/* <section className=""> */}
      {/* <EmptyProductScreen /> */}

      <div className=" w-11/12 my-8 mx-auto">
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6'>
          {Array(20)
            .fill(null)
            .map((_, i: number) => (
              // <p key={i}>Item {i}</p>
              <StoreProductCardComponent key={1} />
            ))}
        </div>
      </div>
    </section>
    // </section>
  )
}
