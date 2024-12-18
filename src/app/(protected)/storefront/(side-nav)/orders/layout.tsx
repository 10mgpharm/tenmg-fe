import { Divider, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import OrdersTabsNavigation from '../../_components/wishlist-component)/OrdersTabsNavigation';




export default function OrdersSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <div className="mt-4 ">
      <h2 className="font-semibold text-2xl text-gray-600">Orders</h2>
      <p className="text-sm font-normal text-gray-500">All your order information is displayed here.</p>
      <Divider my={[2, 5]} border="1px solid gray.200" />
      <div className="mt-2 md:mt-4">
        <Tabs>
          <OrdersTabsNavigation />
          <Divider my={[2, 5]} border="1px solid gray.200" />
          <TabPanels>
            <TabPanel px={0}>
              <div className='border border-gray-200 rounded-md p-4 bg-gray-25'>
                {children}
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>

  )
}
