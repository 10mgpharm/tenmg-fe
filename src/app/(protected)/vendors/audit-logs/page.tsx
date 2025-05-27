"use client";
import {
  Button,
  Divider,
  Flex,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import ActivityLogs from "./_components/ActivityLogs";
import ApiLogs from "./_components/ApiLogs";
import Webhook from "./_components/Webhook";

const AuditLogs = () => {
  return (
    <div className="p-8">
      <HStack justifyContent={"space-between"}>
        <h3 className="font-semibold text-2xl">Audit Logs</h3>
      </HStack>
      <Divider my={2} />
      <Tabs>
        <TabList borderBottom={"0"}>
          <Tab _selected={{ color: "blue.600", bg: "blue.50" }}>
            <div className="px-8 rounded-sm">
              <p className="text-sm">Activity Logs</p>
            </div>
          </Tab>
          <Tab _selected={{ color: "blue.600", bg: "blue.50" }}>
            <div className="px-8 rounded-sm">
              <p className="text-sm text-gray-500">API Logs</p>
            </div>
          </Tab>
          <Tab _selected={{ color: "blue.600", bg: "blue.50" }}>
            <div className="px-8 rounded-sm">
              <p className="text-sm text-gray-500">Webhook Logs</p>
            </div>
          </Tab>
        </TabList>
        <Divider mt={3} />
        <TabPanels>
          <TabPanel>
            <ActivityLogs />
          </TabPanel>
          <TabPanel>
            <ApiLogs />
          </TabPanel>
          <TabPanel>
            <Webhook />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Flex></Flex>
      <Divider my={2} />
    </div>
  );
};

export default AuditLogs;
