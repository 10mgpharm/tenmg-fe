'use client'
import React, { useEffect } from 'react'
import OrderCardComponent from '../../../_components/(my-orders-component)/OrderCardComponent'
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import { useOrdersStore } from '../../../storeFrontState/useMyOrders';
import { Spinner } from '@chakra-ui/react';
import EmptyScreenList from '../../../_components/(my-orders-component)/EmptyOrderScreen';

export default function MyOrdersPages() {

  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const { fetchOrders, orders, loading, pendingOrders,
    cancelledOrders,
    declinedOrders } = useOrdersStore();

  useEffect(() => {
    if (userData?.user?.token) fetchOrders(userData?.user?.token);
  }, [fetchOrders, userData?.user?.token])


  return (
    <div>

      {loading ? <div className='full h-full flex items-center justify-center'><Spinner /></div> : <>
        {
          orders?.length > 0 ? <>
            {orders.map((item, i) => (
              <OrderCardComponent key={i} product={item} />
            ))}
          </>
            : <EmptyScreenList />}
      </>
      }
    </div>
  )
}


