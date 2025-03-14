'use client'
import React, { useEffect, useState } from 'react'
import ReviewsCardComponent from '../../../_components/(reviews-component)/ReviewsCardComponent'
import { useSession } from 'next-auth/react'
import { NextAuthUserSession } from '@/types'
import requestClient from '@/lib/requestClient'
import Image from 'next/image'

export default function Page() {

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [unreviewedProd, setUnreviewedProd] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    const getUnreviewedProducts = async (token) => {
      try {

        const resp = await requestClient({ token }).get("/storefront/reviews/unreviewed");
        // console.log("resp", resp)
        setUnreviewedProd(resp?.data?.data || [])
      } catch (error) {
        console.error(error);
      }
    }

    if (userData?.user?.token) getUnreviewedProducts(userData?.user?.token);
  }, [userData?.user?.token])


  return (
    <div className='w-full'>
      {unreviewedProd?.data?.length > 0 ?
        <>
          {unreviewedProd?.data?.map((item) => (
            <ReviewsCardComponent key={item?.id} product={item} />
          ))}
        </>
        :
        (
          <div className='flex flex-col items-center justify-center w-full h-fit py-32'>
            <Image
              src={'/assets/images/Homework.png'}
              alt=''
              width={300}
              height={300}
            />
            <p className='my-4 font-semibold '>{`You don't have any product to review.`}</p>
          </div>
        )

      }


    </div>
  )
}
