import { Badge, Button, Divider } from '@chakra-ui/react'
import React from 'react'

export default function OrderDetailsCardComp({ }) {
  return (
    <div className='m-4 border border-gray-200 rounded-md p-4'>
      <div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <div style={{ backgroundImage: "url('/assets/images/pillImage.png')" }} className='size-16 bg-cover bg-center bg-no-repeat' />
            <div>
              <h4 className='text-lg font-medium text-gray-700'>MedFERTIL FOR MEN TABLETS - (L-CARNITINE , COQ-10, MULTIVITAMINS)</h4>
              <p className='text-sm  text-gray-500 my-1'>Pentazocine (NEML 23.1)</p>
              <p className={`text-sm text-gray-500`}>Quantity: 15 Pcs</p>
            </div>
          </div>
          {/* <div className='space-y-4'>
            <p className='text-lg font-medium text-gray-900 text-end'>₦{product?.price}</p>
            <div className='space-x-4'>
              <Button className='' variant={"outline"} colorScheme={"blue"} size="sm">Buy Now</Button>
              <Button variant={"outline"} colorScheme={"red"} size="sm">Remove</Button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}


