"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { Spinner } from "@chakra-ui/react";
import { useOrdersStore } from "@/app/(protected)/storefront/(NoSideMenu)/storeFrontState/useMyOrders";
import OrderCardComponent from "@/app/(protected)/storefront/_components/(my-orders-component)/OrderCardComponent";
import EmptyScreenList from "@/app/(protected)/storefront/_components/(my-orders-component)/EmptyOrderScreen";

export default function MyOrdersPages() {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const {
    fetchOrders,
    orders,
    loading,
    pendingOrders,
    cancelledOrders,
    declinedOrders,
  } = useOrdersStore();

  useEffect(() => {
    if (userData?.user?.token) fetchOrders(userData?.user?.token);
  }, [fetchOrders, userData?.user?.token]);

  return (
    <div>
      {loading ? (
        <div className="full h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {orders?.length > 0 ? (
            <>
              {orders.map((item, i) => (
                <OrderCardComponent key={i} product={item} />
              ))}
            </>
          ) : (
            <EmptyScreenList />
          )}
        </>
      )}
    </div>
  );
}
