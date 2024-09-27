import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";

export const options = [
  { label: "12 months", value: "Today" },
  { label: "30 days", value: "Last week" },
  { label: "7 days", value: "Last month" },
  { label: "24 hours", value: "Last year" },
];

const TimelineTabs = () => {
  return (
    <Tabs variant="unstyled" defaultIndex={0} isFitted>
      <TabList>
        {options.map((tab) => (
          <Tab
            _selected={{ bg: "primary.500", color: "white" }}
            h={{ base: "58px", md: "78px" }}
            color="primary.500"
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            key={tab.label}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        <TabPanel px={0}></TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TimelineTabs;
