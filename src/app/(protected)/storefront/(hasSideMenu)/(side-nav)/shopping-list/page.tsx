"use client";
import React, { useEffect, useState } from "react";
import { temp_order } from "../orders/temporders";
import ShoppingListCardComponent from "../../../_components/(shoppinglist-component)/ShoppingListCardComponent";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";
import { useSession } from "next-auth/react";
import { Image, Spinner, Stack, Text } from "@chakra-ui/react";
import { useShoppingList } from "../../../(NoSideMenu)/storeFrontState/useShoppingList";
import emptyCart from "@public/assets/images/emptyOrder.png";
import EmptyScreenList from "../../../_components/(my-orders-component)/EmptyOrderScreen";

export default function ShoppingListPage() {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  // const [loading, setIsLoading] = useState(false);

  // const [shoppingListItems, setShoppingListItems] = useState([]);

  const { fetchShoppingList, loading, shoppingList } = useShoppingList();

  useEffect(() => {
    if (userData?.user?.token) fetchShoppingList(userData?.user?.token);
  }, [fetchShoppingList, userData?.user?.token]);

  console.log("shoppingList", shoppingList);

  return (
    <div>
      {loading ? (
        <div className="w-full h-[50vh] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {shoppingList?.length > 0 ? (
            <div>
              {shoppingList?.map((item) => (
                <ShoppingListCardComponent key={item?.id} product={item} />
              ))}
            </div>
          ) : (
            // <div className="w-full h-[50vh] flex items-center justify-center">
            //   <Stack textAlign="center" alignItems="center" mt={10} gap={6}>
            //     <Image
            //       src={emptyCart.src}
            //       alt="Empty Cart"
            //       boxSize={{ base: "120px", md: "160px" }}
            //     />
            //     <Text fontSize="xl" fontWeight="medium">
            //       You do not have any items in your shopping list
            //     </Text>
            //   </Stack>
            // </div>
            <EmptyScreenList />
          )}
        </>
      )}
    </div>
  );
}
