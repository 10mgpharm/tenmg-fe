'use client'
import React, { useEffect, useState } from 'react'
import ReviewsCardComponent from '../../../_components/(reviews-component)/ReviewsCardComponent'
import { temp_order } from '../../orders/temporders'
import Image from 'next/image'
import { useCartStore } from '../../../storeFrontState/useCartStore'
import { useOrdersStore } from '../../../storeFrontState/useMyOrders'
import { useSession } from 'next-auth/react'
import { NextAuthUserSession } from '@/types'

export default function Page() {

  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const { cart } = useCartStore();

  const { fetchOrders, loading, completedOrders } = useOrdersStore();

  useEffect(() => {

    if (userData?.user?.token) {

      fetchOrders(userData?.user?.token);
    }
  }, [userData?.user?.token, fetchOrders])


  const [products, setProducts] = useState([]);
  // console.log(completedOrders)
  useEffect(() => {
    const extractedProducts = completedOrders
      .flatMap(order => order.items?.map(item => item.product) || [])
      .filter(product => product);

    setProducts(prevProducts => {
      if (JSON.stringify(prevProducts) !== JSON.stringify(extractedProducts)) {
        return extractedProducts;
      }
      return prevProducts;
    });
  }, [completedOrders])


  return (
    <div className='w-full'>
      {products?.map((item) => (
        <ReviewsCardComponent key={item?.id} product={item} />
      ))}

      {/* <div className='flex flex-col items-center justify-center w-full h-fit py-32'>
        <Image
          src={'/assets/images/Homework.png'}
          alt=''
          width={300}
          height={300}
        />
        <p className='my-4 font-semibold '>{`You don't have any product to review.`}</p>
      </div> */}
    </div>
  )
}
