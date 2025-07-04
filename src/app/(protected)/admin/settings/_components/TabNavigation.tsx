"use client";

import { Tabs, TabList, Tab, Text, Tooltip } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import requestClient from "@/lib/requestClient";
import { NextAuthUserSession } from "@/types";

const adminOnlyTabs = ["API Management", "Members"];

const tabs = [
  { label: "General Settings", href: "/admin/settings/general_settings" },
  {
    label: "Business Information",
    href: "/admin/settings/business_information",
  },
  { label: "API Management", href: "/admin/settings/api_management" },
  { label: "Notification", href: "/admin/settings/notifications" },
  { label: "Members", href: "/admin/settings/members" },
];

export default function TabsNavigation() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => pathname.startsWith(tab.href));
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const sessionData = session.data as NextAuthUserSession;

  useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true);
      try {
        const token = sessionData?.user?.token;
        if (!token) {
          setIsAdmin(false);
          return;
        }

        const response = await requestClient({ token: token }).get(
          "/account/profile"
        );
        setIsAdmin(response?.data?.data?.role === "ADMIN");
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [sessionData?.user?.token]);

  const isTabDisabled = (tabLabel: string) => {
    if (isLoading || isAdmin === null) return true;
    if (isAdmin) return false;
    return adminOnlyTabs.includes(tabLabel);
  };

  return (
    <Tabs index={activeIndex} variant="unstyled">
      <TabList overflow={"auto"} className="no-scrollbar flex gap-2">
        {tabs.map((tab, index) => {
          const isDisabled = isTabDisabled(tab.label);
          return (
            <Tooltip
              key={index}
              label={isDisabled ? "Admin access only" : ""}
              isDisabled={!isDisabled}
            >
              <Tab
                as={isDisabled ? "div" : Link}
                {...(!isDisabled ? { href: tab.href } : {})}
                cursor={isDisabled ? "not-allowed" : "pointer"}
                opacity={isDisabled ? 0.5 : 1}
                flexShrink={0}
                _selected={{
                  color: isDisabled ? "gray.400" : "primary.500",
                  bg: isDisabled ? "gray.100" : "primary.50",
                  borderRadius: "10px",
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
