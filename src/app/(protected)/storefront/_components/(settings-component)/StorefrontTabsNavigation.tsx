'use client';

import { Tabs, TabList, Tab, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { label: 'Personal Information', href: '/storefront/settings/profile-information' },
  { label: 'Password', href: '/storefront/settings/password' },
  { label: 'Shipping Address', href: '/storefront/settings/shipping-address' },
  { label: 'Legal ID and License', href: '/storefront/settings/legal-license' },
];


export default function StorefrontTabsNavigation() {
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