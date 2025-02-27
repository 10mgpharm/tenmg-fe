import Image from 'next/image'
import React from 'react'
import emptyRecord from '@public/assets/images/e-record-lenders.png';

export default function LenderEmptyScreen({ heading, content }: { heading: string, content: string }) {
  return (
    <div className='mt-24'>
      <Image src={emptyRecord} alt='' className='mx-auto' />
      <div className="max-w-xs mx-auto mt-4 text-center">
        <h3 className='text-xl font-semibold text-gray-700'>{heading}</h3>
        <p className='mt-3'>{content}</p>
      </div>
    </div>
  )
}
