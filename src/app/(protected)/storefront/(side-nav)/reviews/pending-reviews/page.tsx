import React from 'react'
import ReviewsCardComponent from '../../../_components/(reviews-component)/ReviewsCardComponent'
import { temp_order } from '../../orders/temporders'
import Image from 'next/image'

export default function page() {
  return (
    <div className='w-full'>
      {/* {temp_order.slice(0, 3).map((item) => (
        <ReviewsCardComponent key={item?.order_id} product={item} />
      ))} */}

      <div className='flex items-center justify-center w-full h-fit py-32'>
        <Image
          src={'/assets/images/Homework.png'}
          alt=''
          width={300}
          height={300}
        />
        <p>{`You don't have any product to review.`}</p>
      </div>
    </div>
  )
}
