'use client';

import { Tabs, TabList, Tab, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { label: 'All Orders', href: '/storefront/orders/my-orders' },
  { label: 'Pending Orders', href: '/storefront/orders/pending-orders' },
  { label: 'Completed Orders', href: '/storefront/orders/completed-orders' },
  { label: 'Cancelled Orders', href: '/storefront/orders/cancelled-orders' },
];


export default function OrdersTabsNavigation() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => pathname.startsWith(tab.href));

  return (
    <Tabs index={activeIndex} variant="unstyled">
      <TabList overflow={"auto"}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            as={Link}
            href={tab.href}
            _selected={{
              color: "primary.500",
              bg: "primary.50",
              borderRadius: "10px",
            }}
          >
            <div className="flex items-center gap-3">
              <Text fontSize={{ base: "xs", md: "sm" }}>
                {tab.label}
              </Text>
            </div>
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}