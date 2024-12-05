'use client'
import React from 'react'
import StoreProductCardComponent from '../components/StoreProductCardComponent'

export default function StoreFrontByCategory() {

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6'>
        {Array(20)
          .fill(null)
          .map((_, i: number) => (
            // <p key={i}>Item {i}</p>
            <StoreProductCardComponent key={1} />
          ))}
      </div>
    </div>
  )
}
