"use client";

import { Tabs, TabList, Tab } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    label: "Personal Information",
    href: "/suppliers/settings/personal_information",
  },
  { label: "Password", href: "/suppliers/settings/password" },
  { label: "Notification Settings", href: "/suppliers/settings/notifications" },
  { label: "License Upload", href: "/suppliers/settings/license_upload" },
  { label: "Store Address", href: "/suppliers/settings/store_address" },
];

export default function TabsNavigation() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => pathname.startsWith(tab.href));

  return (
    <Tabs index={activeIndex} variant="unstyled" width="100%">
      <TabList className="flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            as={Link}
            href={tab.href}
            _selected={{ color: "white", bg: "#1A70B8", borderRadius: "10px" }}
            className="whitespace-nowrap text-sm md:text-base p-2 md:p-3"
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
