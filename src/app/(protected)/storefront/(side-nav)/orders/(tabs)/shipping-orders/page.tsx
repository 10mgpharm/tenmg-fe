'use client'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import { Spinner } from '@chakra-ui/react';
import { useOrdersStore } from '@/app/(protected)/storefront/storeFrontState/useMyOrders';
import OrderCardComponent from '@/app/(protected)/storefront/_components/(my-orders-component)/OrderCardComponent';
import EmptyScreenList from '@/app/(protected)/storefront/_components/(my-orders-component)/EmptyOrderScreen';

export default function PendingOrdersPages() {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const { fetchOrders, loading, shippingOrders, } = useOrdersStore();

  useEffect(() => {
    if (userData?.user?.token) fetchOrders(userData?.user?.token);
  }, [fetchOrders, userData?.user?.token])


  return (
    <div>

      {loading ? <div className='full h-full flex items-center justify-center'><Spinner /></div> : <>
        {
          shippingOrders?.length > 0 ? <>
            {shippingOrders.map((item, i) => (
              <OrderCardComponent key={i} product={item} />
            ))}
          </>
            : <EmptyScreenList />}
      </>
      }
    </div>
  )
}


