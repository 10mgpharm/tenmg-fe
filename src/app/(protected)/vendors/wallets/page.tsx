"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import TimeLineSelector from "./_components/TimeLineSelector";
import LoanWallet from "./_components/loanWallet";
import ProductWallet from "./_components/productWallet";

const Wallets = () => {
  const [selectedTimeLine, setSelectedTimeLine] = React.useState("12 months");

  return (
    <div className="p-5">
      <Tabs variant={"unstyled"}>
        <div className="flex items-center justify-between gap-4 max:sm:flex-col">
          <TabList className="flex items-center gap-3">
            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="rounded-lg bg-gray-100  text-[15px] text-gray-700"
            >
              Product Wallet
            </Tab>

            <Tab
              _selected={{ color: "white", bg: "#1A70B8" }}
              className="rounded-lg bg-gray-100  text-[15px] text-gray-700"
            >
              Loan Wallet
            </Tab>
          </TabList>

          <TimeLineSelector
            selectedTimeLine={selectedTimeLine}
            setSelectedTimeLine={setSelectedTimeLine}
          />
        </div>

        <TabPanels>
          <TabPanel className="!p-0">
            <ProductWallet />
          </TabPanel>
          <TabPanel className="!p-0">
            <LoanWallet />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Wallets;
