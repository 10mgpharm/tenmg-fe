import requestClient from '@/lib/requestClient'
import { NextAuthUserSession } from '@/types';
import { Badge, Button, Divider } from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import React from 'react'
import { toast } from 'react-toastify';

export default function ShoppingListCardComponent({ product }) {

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const handleRemove = async (id) => {
    try {
      const resp = await requestClient({ token: userData?.user?.token }).delete(`/storefront/shopping-list/remove-item/${id}`)
      if (resp?.data?.status === 'success') {
        toast.success('Item removed successfully')
        window.location.reload()
      }
    } catch (e) {
      console.log(e)
      toast.error('Could not remove item, please try again')
    }
  }

  {/* Is there a way to chck if the product is available before proceeding to buy 
  product description missing from the backend
  */}

  return (
    <div className='m-4 border border-gray-200 rounded-md p-4'>
      <div className='flex justify-between items-center flex-col md:flex-row'>
        <div className='flex items-center gap-4 w-8/12 flex-col md:flex-row'>
          <div style={{ backgroundImage: `url( ${product?.image ? product?.image : '/assets/images/pillImage.png'})` }} className='size-16 bg-cover bg-center bg-no-repeat shadow-sm shadow-black/50 rounded-sm' />
          <div>
            <h4 className='text-lg font-medium text-gray-700 space-y-1'>{product?.productName}</h4>
            <p className='text-base  text-gray-500 my-1'>{product?.brandName}</p>
            <p className='text-sm  text-gray-500 my-1'>{product?.purchaseDate}</p>

            <p className='text-xs  text-gray-700 my-1'>{product?.description}</p>
          </div>
        </div>
        <div className='space-x-4 '>
          <Button className='' variant={"outline"} colorScheme={"blue"} size="sm">Buy Now</Button>
          <Button variant={"outline"} colorScheme={"red"} size="sm" onClick={() => handleRemove(product?.id)}>Remove</Button>

        </div>

      </div>
    </div>
  )
}
