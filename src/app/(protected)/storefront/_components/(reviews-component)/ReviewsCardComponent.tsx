import { Button } from '@chakra-ui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import React from 'react'
import WriteReviewModal from './ReviewModal'

export default function ReviewsCardComponent({ product }) {

  return (
    <div className='m-4 border border-gray-200 rounded-md p-4'>
      <div>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
          <div className='grid grid-cols-6 gap-2 col-span-4'>
            <div style={{ backgroundImage: `url( ${product?.thumbnailFile && product?.thumbnailFile?.length > 0 ? product?.thumbnailFile : '/assets/images/pillImage.png'})` }} className=' w-full h-full col-span-1 size-16 bg-cover bg-center bg-no-repeat' />
            <div className='col-span-5'>
              <h4 className='text-lg font-medium text-gray-700'>{product?.name} {product?.variation?.strengthValue}{product?.measurement?.name}</h4>
              <p className='text-sm  text-gray-500 my-1'>{product?.description}</p>
              <div className="flex items-center">
                <StarIcon className="w-5 fill-gray-400 stroke-none" />
                <StarIcon className="w-5 fill-gray-400 stroke-none" />
                <StarIcon className="w-5 fill-gray-400 stroke-none" />
                <StarIcon className="w-5 fill-gray-400 stroke-none" />
                <StarIcon className="w-5 fill-gray-400 stroke-none" />
              </div>
            </div>
          </div>
          <div className='cols-span-1'>
            <WriteReviewModal prod_id={product?.id} prod_name={product?.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
