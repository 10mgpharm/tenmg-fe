import { Badge, Button, Divider } from '@chakra-ui/react'
import React from 'react'

export default function OrderCardComponent({ product }) {
  return (
    <div className='m-4 border border-gray-200 rounded-md p-4'>
      <div className='flex justify-between '>
        <div>
          <h4 className='text-lg font-medium text-gray-700'>Order #{product?.order_id}</h4>
          <p className='text-sm  text-gray-500 my-1'>{product?.created_at}</p>
          <p className={`text-xs  py-1 px-3 rounded-md  w-fit ${product?.status.toLowerCase() === 'completed' ? "text-green-100 bg-green-500" : product?.status.toLowerCase() === "pending" ? "text-amber-100 bg-amber-500" : "text-red-100 bg-red-500"} `}>{product?.status}</p>
        </div>
        <p className='text-lg font-medium text-gray-900'>₦{product?.price}</p>
      </div>
      <Divider className='my-3' />
      <div>
        <div className='flex justify-between'>
          <div>
            <div />
            <div>
              <h4 className='text-lg font-medium text-gray-700'>{product?.product}</h4>
              <p className='text-sm  text-gray-500 my-1'>{product?.description}</p>
              <p className={`text-sm text-gray-500`}>Quantity: {product?.quantity} Pcs</p>
            </div>
          </div>
          <Button variant="outline" size="sm" colorScheme={"blue"}>View Order</Button>
        </div>
      </div>
    </div>
  )
}
