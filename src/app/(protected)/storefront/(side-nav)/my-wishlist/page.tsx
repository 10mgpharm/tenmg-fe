'use client'
import React, { useEffect } from 'react'
import { temp_order } from '../orders/temporders'
import WishListCardComponent from '../../_components/(wishlist-component)/WishListCardComponent'
import { useWishlistStore } from '../../storeFrontState/useWIshlist';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import EmptyWishList from '../../_components/(wishlist-component)/EmptyWishlist';
import { Spinner } from '@chakra-ui/react';

export default function MyWishListPage() {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const { fetchWishlist, wishlist, loading, removeWishlistItem } = useWishlistStore();

  console.log("wishlist", wishlist)

  useEffect(() => {
    if (userData?.user?.token) fetchWishlist(userData?.user?.token);
  }, [fetchWishlist, userData?.user?.token])

  return (
    <div>
      <div>
        {loading ? <div className='full h-full flex items-center justify-center'><Spinner /></div> : <>        {wishlist?.length > 0
          ? <>
            {wishlist?.map((item, i) => (
              <WishListCardComponent key={i} product={item} token={userData?.user?.token} />
            ))}</>
          : <EmptyWishList />
        }</>}

      </div>
    </div>
  )
}
