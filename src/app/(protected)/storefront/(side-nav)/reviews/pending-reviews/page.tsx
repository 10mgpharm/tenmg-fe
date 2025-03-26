'use client'
import React, { useEffect, useState } from 'react'
import ReviewsCardComponent from '../../../_components/(reviews-component)/ReviewsCardComponent'
import { useSession } from 'next-auth/react'
import { NextAuthUserSession } from '@/types'
import requestClient from '@/lib/requestClient'
import Image from 'next/image'
import { Spinner } from '@chakra-ui/react'

export default function Page() {

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [unreviewedProd, setUnreviewedProd] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const getUnreviewedProducts = async (token) => {
      setLoading(true);
      try {

        const resp = await requestClient({ token }).get("/storefront/reviews/unreviewed");
        // console.log("resp", resp)
        setUnreviewedProd(resp?.data?.data || [])
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (userData?.user?.token) getUnreviewedProducts(userData?.user?.token);

    // return setLoading(false)
  }, [userData?.user?.token])

  // console.log("unreviewedProd", unreviewedProd)
  // console.log("loading", loading)


  return (
    <div className='w-full'>
      {loading ? <div className='flex justify-center items-center w-full h-96'>
        <Spinner />
      </div>
        :
        <>
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
        </>}


    </div>
  )
}
