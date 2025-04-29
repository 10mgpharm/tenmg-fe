"use client";

import { Tabs, TabList, Tab, Text, Tooltip } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BusinessStatus } from "@/constants";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";

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

const vendorOnlyTabs = ["API Key and Web-hooks", "Team Members", "License Upload"];

const mustAlwaysBeEnabled = (name: string) =>
  ["General Settings", "Business Information", "Notification", "License Upload"].includes(name);

const isLinkDisabled = (businessStatus: string, name: string) => {
  const disabledBusinessStatuses = [
    BusinessStatus.PENDING_VERIFICATION,
    BusinessStatus.PENDING_APPROVAL,
    BusinessStatus.REJECTED,
    BusinessStatus.SUSPENDED,
    BusinessStatus.BANNED,
  ];
  
  return disabledBusinessStatuses.includes(businessStatus as BusinessStatus) && !mustAlwaysBeEnabled(name);
};

export default function TabsNavigation({
  businessStatus,
}: {
  businessStatus: string;
}) {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => pathname.startsWith(tab.href));
  const [isVendor, setIsVendor] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  const isTabDisabled = (tabLabel: string) => {
    if (isLoading || isVendor === null) return true;
    return !isVendor && vendorOnlyTabs.includes(tabLabel);
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true);
      try {
        const token = sessionData?.user?.token;
        if (!token) {
          setIsVendor(false);
          return;
        }

        const response = await requestClient({ token: token }).get(
          "/account/profile"
        );

        setIsVendor(response?.data?.data?.role === "VENDOR");
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsVendor(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionData?.user?.token) {
      fetchUserRole();
    }
  }, [sessionData]);

  return (
    <Tabs index={activeIndex} variant="unstyled">
      <TabList overflow={"auto"}>
        {tabs.map((tab, index) => {
          const disabledByStatus = isLinkDisabled(businessStatus, tab.label);
          const disabledByRole = isTabDisabled(tab.label);
          const isDisabled = disabledByStatus || disabledByRole;
          
          const tooltipLabel = isDisabled 
            ? disabledByRole 
              ? "Vendor access only" 
              : "Not available with current business status"
            : "";

          return (
            <Tooltip
              key={index}
              label={tooltipLabel}
              isDisabled={!isDisabled}
            >
              <Tab
                as={isDisabled ? "div" : Link}
                {...(!isDisabled ? { href: tab.href } : {})}
                cursor={isDisabled ? "not-allowed" : "pointer"}
                opacity={isDisabled ? 0.5 : 1}
                _selected={{
                  color: "primary.500",
                  bg: "primary.50",
                  borderRadius: "10px",
                }}
                _hover={{
                  color: isDisabled ? "gray.400" : "primary.500",
                  bg: isDisabled ? "gray.100" : "primary.50",
                }}
              >
                <div className="flex items-center gap-3">
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color={isDisabled ? "gray.400" : "inherit"}
                  >
                    {tab.label}
                  </Text>
                </div>
              </Tab>
            </Tooltip>
          );
        })}
      </TabList>
    </Tabs>
  );
}
