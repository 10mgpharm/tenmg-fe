import { Button, Divider } from "@chakra-ui/react";
import React from "react";
import AddShoppingList from "../../../_components/(shoppinglist-component)/AddShoppingList";

export default function OrdersSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-4 ">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="font-semibold text-2xl text-gray-600">
            Shopping List
          </h2>
          <p className="text-sm font-normal text-gray-500">
            List of items you plan to purchase.
          </p>
        </div>

        <AddShoppingList />
      </div>
      <Divider my={[2, 5]} border="1px solid gray.200" />
      <div className="mt-2 md:mt-4">
        <div className="border border-gray-200 rounded-md p-4 bg-gray-25">
          {children}
        </div>
      </div>
    </div>
  );
}
