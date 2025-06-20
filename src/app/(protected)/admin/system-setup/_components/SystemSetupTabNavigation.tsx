"use client";

import { Tabs, TabList, Tab, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    label: "Medication Setup",
    href: "/admin/system-setup/medication_setup"
  },
  {
    label: "Storefront",
    href: "/admin/system-setup/storefront",
  },
  {
    label: "Shipping Fee",
    href: "/admin/system-setup/shipping-fee",
  },
  {
    label: "Interest and Loan Config",
    href: "/admin/system-setup/loan_config",
  },
  {
    label: "Credit Parameters",
    href: "/admin/system-setup/business_rules",
  },
];

export default function SystemSetupTabNavigation() {
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
              <Text fontSize={{ base: "xs", md: "sm" }}>{tab.label}</Text>
            </div>
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
