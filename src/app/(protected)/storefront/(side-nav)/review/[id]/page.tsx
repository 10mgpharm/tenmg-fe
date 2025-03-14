'use client'
import React, { useEffect, useState } from 'react'
import { StarIcon } from 'lucide-react'
import Link from 'next/link'
import { temp_order } from '../../orders/temporders'
import BreadCrumbBanner from '../../../_components/BreadCrumbBanner'
import { useSession } from 'next-auth/react'
import { NextAuthUserSession } from '@/types'
import requestClient from '@/lib/requestClient'

export default function ReviewPage() {

  const breadCrumb = [
    {
      text: 'Reviews',
      link: '/reviews/reviewed'
    },
    {
      text: 'Product',
      link: '#'
    },
  ]

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {

    const getReviews = async (token) => {
      setLoading(true);
      try {

        const resp = await requestClient({ token }).get("/storefront/reviews/7");
        console.log("resp", resp)
        setReviews(resp?.data?.data || [])
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    if (userData?.user?.token) getReviews(userData?.user?.token);
  }, [userData?.user?.token])


  return (
    <div>
      {/* <BreadCrumbBanner breadCrumbsData={breadCrumb} /> */}
      <ReviewPageProductCard product={temp_order[0]} />
    </div>
  )
}


const ReviewPageProductCard = ({ product }) => {
  return (
    <>
      <div className='m-4 border border-gray-200 rounded-md p-4'>
        <div>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div style={{ backgroundImage: "url('/assets/images/pillImage.png')" }} className='size-16 bg-cover bg-center bg-no-repeat' />
              <div>
                <h4 className='text-lg font-medium text-gray-700'>{product?.product}</h4>
                <p className='text-sm  text-gray-500 my-1'>{product?.description}</p>
                <div className="flex items-center">
                  <StarIcon className="w-5 fill-warning-400 stroke-none" />
                  <StarIcon className="w-5 fill-warning-400 stroke-none" />
                  <StarIcon className="w-5 fill-warning-400 stroke-none" />
                  <StarIcon className="w-5 fill-warning-400 stroke-none" />
                  <StarIcon className="w-5 fill-warning-400 stroke-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='m-4 border border-gray-200 rounded-md p-4'>
        <div className='flex items-center justify-between'>
          <h4 className='text-lg font-medium text-gray-700'>{`Frances Guerrero`}</h4>
          <div className="flex items-center">
            <StarIcon className="w-5 fill-warning-400 stroke-none" />
            <StarIcon className="w-5 fill-warning-400 stroke-none" />
            <StarIcon className="w-5 fill-warning-400 stroke-none" />
            <StarIcon className="w-5 fill-warning-400 stroke-none" />
            <StarIcon className="w-5 fill-warning-400 stroke-none" />
          </div>
        </div>

        <h3>{`A must-have product`}</h3>
        <p>{`Empowering health decisions, one capsule at a time! Capsule Insight empowers informed health decisions with concise and reliable information. It's a valuable companion for health-conscious individuals.`}</p>
      </div>
    </>
  )
}