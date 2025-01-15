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
import { Spinner } from '@chakra-ui/react'



export default function StoreFrontByCategory() {

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const path = usePathname();
  const splitPath = path.split('/');
  const category = splitPath[splitPath.length - 1];

  const categoryParam = category?.split("-").join(" ");

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("categoryData", categoryData);

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
      text: `${loading ? <Spinner /> : categoryData?.name}`,
      link: '#'
    }
  ]


  useEffect(() => {
    setLoading(true);
    const fetchCategoryData = async () => {
      try {
        const data = await requestClient({ token: userData?.user?.token }).get(`/storefront/categories/${category}`);
        console.log("data", data?.data?.data?.category);
        // setCategoryData([]);
        setCategoryData(data?.data?.data?.category);
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryData();


  }, [userData?.user?.token, category]);


  return (
    <section className="">
      <BreadCrumbBanner breadCrumbsData={breadCrumb} />
      {/* <section className=""> */}
      {/* <EmptyProductScreen /> */}

      {loading ? <div className='w-full h-screen flex items-center justify-center'> <Spinner /></div> :
        <>
          <div className=" w-11/12 my-8 mx-auto">
            <div className={`gap-x-4 gap-y-6 w-full   ${categoryData?.products?.data?.length > 0 ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4" : " "}`}>
              {categoryData?.products?.data && categoryData?.products?.data?.length > 0 ? categoryData?.products?.data?.map((data: any, i: number) => (
                // <p key={i}>Item {i}</p>
                <StoreProductCardComponent key={i} product={data} />
              ))

                : <EmptyProductScreen />
              }
            </div>
          </div>
        </>
      }
    </section>
    // </section>
  )
}
