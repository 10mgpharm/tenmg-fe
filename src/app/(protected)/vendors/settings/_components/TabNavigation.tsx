"use client";

import { Tabs, TabList, Tab, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BusinessStatus } from "@/constants";

const tabs = [
  { label: "General Settings", href: "/vendors/settings/general_settings" },
  {
    label: "Business Information",
    href: "/vendors/settings/business_information",
  },
  { label: "Notification", href: "/vendors/settings/notifications" },
  { label: "License Upload", href: "/vendors/settings/license_upload" },
  { label: "Team Members", href: "/vendors/settings/team_members" },
  { label: "API Key and Web-hooks", href: "/vendors/settings/api_keys" },
];

const mustAlwaysBeEnabled = (name: string) =>
  ["General Settings", "Business Information", "Notification", "License Upload"].includes(name);

const isLinkDisabled = (businessStatus: string, name: string) => {
  const disabledBusinessStatuses = [
    BusinessStatus.PENDING_VERIFICATION,
    BusinessStatus.PENDING_APPROVAL,
    BusinessStatus.REJECTED,
    BusinessStatus.LICENSE_EXPIRED,
    BusinessStatus.SUSPENDED,
    BusinessStatus.BANNED,
  ];
  return disabledBusinessStatuses.includes(businessStatus as BusinessStatus) &&
    !mustAlwaysBeEnabled(name)
    ? true
    : false;
};

export default function TabsNavigation({
  businessStatus,
}: {
  businessStatus: string;
}) {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => pathname.startsWith(tab.href));

  return (
    <Tabs index={activeIndex} variant="unstyled">
      <TabList overflow={"auto"}>
        {tabs.map((tab, index) => {
          const disabled = isLinkDisabled(businessStatus, tab.label);
          return (
            <Tab
              key={index}
              as={Link}
              href={disabled ? '#' : tab.href}
              isDisabled={disabled}
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
          );
        })}
      </TabList>
    </Tabs>
  );
}
