import { Divider, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import LenderTabsNavigation from "../_components/LenderTabsNavigation";

export default function StorefrontSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-4 mx-10">
      <h2 className="font-semibold text-2xl text-gray-600">Settings</h2>
      <p className="text-sm font-normal text-gray-500">
        Manage all your personal information and account settings.
      </p>
      <Divider my={[2, 5]} border="1px solid gray.200" />
      <div className="mt-2 md:mt-4">
        <Tabs>
          <LenderTabsNavigation />
          <Divider my={[2, 5]} border="1px solid gray.200" />
          <TabPanels>
            <TabPanel px={0}>
              <div className="px-1 lg:px-10">{children}</div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
