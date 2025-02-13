'use client';

import { Tabs, TabList, Tab, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { label: 'General Settings', href: '/lenders/settings/general-settings' },
  { label: 'Business Information', href: '/lenders/settings/business-information' },
  { label: 'Loan Configuration', href: '/lenders/settings/loan-configuration' },
  { label: 'Notification', href: '/lenders/settings/notifications' },
  { label: 'License Upload', href: '/lenders/settings/license-upload' },
];


export default function LenderTabsNavigation() {
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