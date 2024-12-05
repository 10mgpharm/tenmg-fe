import { StarIcon } from 'lucide-react'
import React from 'react'

export default function StoreProductReviewComponent() {
  return (
    <div className='border border-gray-200 rounded-md p-5 flex flex-col gap-1 w-9/12 mx-auto'>
      <h4 className='text-lg text-primary-500 font-semibold'>Frances Guerrero</h4>

      <div className='flex items-center'>
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
      </div>

      <p className='text-lg font-normal text-gray-500'>
        {`Empowering health decisions, one capsule at a time! Capsule Insight empowers informed health decisions with concise and reliable information. It's a valuable companion for health-conscious individuals.`}
      </p>
    </div>
  )
}
//