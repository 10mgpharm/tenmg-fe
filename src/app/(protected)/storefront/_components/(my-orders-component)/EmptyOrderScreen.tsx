import Image from 'next/image'
import React from 'react'

export default function EmptyScreenList() {
  return (
    <section className='w-11/12 lg:w-10/12  py-20 mx-auto flex flex-col items-center justify-center gap-4'>

      <Image
        src='/assets/images/no-product.jpg'
        alt=''
        width={300}
        height={300}
      />

      <div>
        <p className='text-base my-2 text-center'>Nothing to display yet..!</p>
      </div>

    </section>
  )
}
