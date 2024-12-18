import { Badge, Button, Divider } from '@chakra-ui/react'
import React from 'react'

export default function ShoppingListCardComponent({ product }) {
  return (
    <div className='m-4 border border-gray-200 rounded-md p-4'>
      <div className='flex justify-between '>
        <div>
          <h4 className='text-lg font-medium text-gray-700'>Order #{product?.order_id}</h4>
          <p className='text-sm  text-gray-500 my-1'>{product?.created_at}</p>
        </div>
        <p className='text-lg font-medium text-gray-900'>{product?.price}</p>
      </div>
      <Divider className='my-3' />
      <div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <div style={{ backgroundImage: "url('/assets/images/pillImage.png')" }} className='size-16 bg-cover bg-center bg-no-repeat' />
            <div>
              <h4 className='text-lg font-medium text-gray-700'>{product?.product}</h4>
              <p className='text-sm  text-gray-500 my-1'>{product?.description}</p>
              <p className={`text-sm text-gray-500`}>{product?.quantity}</p>
            </div>
          </div>
          <div className='space-x-4'>
            <Button className='' variant={"outline"} colorScheme={"blue"} size="sm">Buy Now</Button>
            <Button variant={"outline"} colorScheme={"red"} size="sm">Remove</Button>

          </div>
        </div>
      </div>
    </div>
  )
}
