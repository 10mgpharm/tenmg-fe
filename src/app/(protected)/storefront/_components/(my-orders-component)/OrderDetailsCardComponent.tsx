'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

export default function OrderDetailsCardComp({ prod }) {
  const router = useRouter();
  return (
    <div className='m-4 border border-gray-200 rounded-md p-4'>
      <div onClick={() => router.push(`/storefront/product/${prod?.product?.slug}`)} className='cursor-pointer'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <div style={{ backgroundImage: `url(${prod?.product?.thumbnailFile})` }} className='size-16 bg-cover bg-center bg-no-repeat' />
            <div>
              <h4 className='text-lg font-medium text-gray-700'>
                {prod?.product?.name} {prod?.product?.variation?.strengthValue}{prod?.product?.measurement?.name}</h4>
              <p className='text-sm  text-gray-500 my-1 line-clamp-1'>{prod?.product?.description}</p>
              <p className={`text-sm text-gray-500`}>Quantity: {prod?.quantity} Pcs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


