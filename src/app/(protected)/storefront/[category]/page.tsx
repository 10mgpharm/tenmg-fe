'use client'
import React, { useEffect, useState } from 'react'
import StoreProductCardComponent from '../_components/StoreProductCardComponent'
// import EmptyProductScreen from '../_components/EmptyProductScreen'
import BreadCrumbBanner from '../_components/BreadCrumbBanner'
import { usePathname } from 'next/navigation'
import requestClient from '@/lib/requestClient'
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from '@/types'
import EmptyProductScreen from '../_components/EmptyProductScreen'



export default function StoreFrontByCategory() {

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const path = usePathname();
  const splitPath = path.split('/');
  const category = splitPath[splitPath.length - 1];




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
      text: category,
      link: '#'
    }
  ]

  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {

    const fetchCategoryData = async () => {
      try {
        const data = await requestClient({ token: userData?.user?.token }).get(`/storefront/categories/${category}`);
        // console.log(data);
        setCategoryData(data?.data?.data);
      } catch (e) {
        console.log(e)
      }
    }
    fetchCategoryData();


  }, [userData?.user?.token, category]);


  return (
    <section className="">
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      {/* <section className=""> */}
      {/* <EmptyProductScreen /> */}

      <div className=" w-11/12 my-8 mx-auto">
        <div className={`gap-x-4 gap-y-6 w-full   ${categoryData?.data.length > 0 ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4" : " "}`}>
          {categoryData?.data && categoryData?.data.length > 0 ? categoryData?.data
            .map((data: any, i: number) => (
              // <p key={i}>Item {i}</p>
              <StoreProductCardComponent key={i} product={data} />
            ))

            : <EmptyProductScreen />
          }
        </div>
      </div>
    </section>
    // </section>
  )
}
