"use client";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import SignUpField from "./SignupField";

const tabNames = ["supplier", "pharmacy"];

export default function SignupTab() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tab = searchParams.get("tab");
  const [tabIndex, setTabIndex] = useState(0);

  // Update tabIndex when the 'tab' query parameter changes
  useEffect(() => {
    const index = tab ? tabNames.indexOf(tab.toLowerCase()) : 0;
    if (index !== -1 && index !== tabIndex) {
      setTabIndex(index);
    }
  }, [tab, tabIndex]);

  // Handle tab changes without causing a full page navigation
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabNames[index]);
    const newUrl = `${pathname}?${params.toString()}`;

    // Update the URL without triggering navigation
    window.history.replaceState(null, "", newUrl);
  };

  return (
    <Tabs
      variant="unstyled"
      index={tabIndex}
      onChange={handleTabsChange}
      isFitted
    >
      <TabList>
        <Tab
          _selected={{ bg: "primary.500", color: "white" }}
          h={{ base: "58px", md: "78px" }}
          color="primary.500"
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
        >
          Supplier
        </Tab>
        <Tab
          _selected={{ bg: "primary.500", color: "white" }}
          h={{ base: "58px", md: "78px" }}
          color="primary.500"
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
        >
          Pharmacy or Hospital
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel px={0}>
          <SignUpField title="supplier" tabIndex={tabIndex} />
        </TabPanel>
        <TabPanel px={0}>
          <SignUpField title="pharmacy" tabIndex={tabIndex}/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
