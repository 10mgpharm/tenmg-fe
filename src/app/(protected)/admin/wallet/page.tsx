"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import ProductWallet from "./_components/productWallet";
import LoanWallets from "./_components/LoanWallets";
import TimeLineSelector from "./_components/TimeLineSelector";

const Page = () => {
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");

  return (
    <div className="px-6 py-8 md:p-8 ">
      <Tabs variant={"unstyled"} className="w-full">
        {/* Tabs */}
        <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-4">
          <TabList className="flex items-center gap-4">
            <Tab
              _selected={{
                color: "white",
                bg: "#1A70B8",
              }}
              className="text-[16px] font-medium text-gray-700 bg-gray-100 rounded-lg"
            >
              Product Wallet
            </Tab>

            <Tab
              _selected={{
                color: "white",
                bg: "#1A70B8",
              }}
              className="text-[16px] font-medium text-gray-600 bg-gray-100 rounded-lg"
            >
              Loan Wallet
            </Tab>
          </TabList>

          {/* Date filter */}
          <TimeLineSelector
            selectedTimeLine={selectedTimeLine}
            setSelectedTimeLine={setSelectedTimeLine}
          />
        </div>

        {/* panels */}
        <TabPanels className="mt-10 max-sm:mt-8">
          <TabPanel className="!p-0">
            <ProductWallet filterDate={selectedTimeLine} />
          </TabPanel>
          <TabPanel className=" !p-0">
            <LoanWallets filterDate={selectedTimeLine} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Page;
