'use client'
import React, { useEffect, useState } from 'react'
import { temp_order } from '../orders/temporders'
import ShoppingListCardComponent from '../../_components/(shoppinglist-component)/ShoppingListCardComponent'
import requestClient from '@/lib/requestClient';
import { NextAuthUserSession } from '@/types';
import { useSession } from 'next-auth/react';
import { Spinner } from '@chakra-ui/react';

export default function ShoppingListPage() {

  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const [loading, setIsLoading] = useState(false);

  const [shoppingListItems, setShoppingListItems] = useState([]);

  useEffect(() => {
    const fetchStoreFront = async () => {
      setIsLoading(true);
      try {
        const data = await requestClient({ token: userData?.user?.token }).get(
          "/storefront/shopping-list"
        );

        console.log("shopping list", data?.data?.data);
        setShoppingListItems(data?.data?.data);
      } catch (e) {
        // !Todo: handle error
        // toast.error("Could not fetch store, please try again")
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoreFront();
  }, [userData?.user?.token]);

  if (loading) {
    return <div className="w-full h-[50vh] flex items-center justify-center"><Spinner /></div>;
  }
  return (
    <div>
      <div>
        {shoppingListItems?.map((item) => (
          <ShoppingListCardComponent key={item?.id} product={item} />
        ))}
      </div>
    </div>
  )
}
