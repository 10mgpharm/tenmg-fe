import { StarIcon } from 'lucide-react'
import React from 'react'

export default function StoreProductReviewComponent({ data }) {

  console.log("review", data)
  return (
    <div className='border border-gray-200 rounded-md p-5 flex flex-col gap-1 w-full lg:w-9/12 mx-auto'>
      <h4 className='text-lg text-primary-500 font-semibold'>{data?.name}</h4>

      {/* // !TODO: refactor this to be the chakra ui star rating component */}
      <div className='flex items-center'>
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
        <StarIcon className='w-5 fill-warning-400 stroke-none' />
      </div>

      <p className='text-lg font-normal text-gray-500'>
        {data?.comment}
      </p>
    </div>
  )
}
//