"use client";

import { Flex, Spinner, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import OverviewCard from "../../../wallet/_components/OverviewCard";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { transactionData } from "@/data/mockdata";
import WalletTable from "../../../wallet/_components/table";
const Wallet = () => {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagecount, setPageCount] = useState(1);

  const awaiting = transactionData.filter((item) => item.type === "Awaiting");
  const completed = transactionData.filter((item) => item.type === "Completed");
  const history = transactionData.filter((item) => item.type === "History");

  // random data
  const metaData = {
    links: "",
    prevPageUrl: "",
    nextPageUrl: "",
    currentPage: 1,
    firstPageUrl: "",
    lastPageUrl: "",
  };

  return (
    <div>
      <div className="p-5">
        {isLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <div className="">
            <Flex
              cursor={"pointer"}
              onClick={() => router.back()}
              align={"center"}
              gap={2}
              className=""
            >
              <ArrowLeft className="w-5 h-auto text-gray-500" />
              <Text fontSize={"14px"} color={"gray.600"}>
                Back
              </Text>
            </Flex>
            <h3 className="font-bold pt-3 text-[20px] ">
              Onyejekwe Ugonna Wallet
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-5 c">
              <OverviewCard
                title="Total Commission Earned"
                value="₦5,600"
                fromColor="from-[#53389E]"
                toColor="to-[#7F56D9]"
                image={totalPattern}
              />
              <OverviewCard
                title="Total Payouts to Suppliers"
                value="₦2,300"
                fromColor="from-[#DC6803]"
                toColor="to-[#DC6803]"
                image={orderPattern}
              />
              <OverviewCard
                title="Wallet Balance"
                value="₦50,000"
                fromColor="from-[#E31B54]"
                toColor="to-[#E31B54]"
                image={productPattern}
              />
            </div>

            <Tabs variant={"unstyled"} className="mt-7">
              <TabList className="flex flex-nowrap gap-4 overflow-x-scroll no-scrollbar  ">
                <Tab
                  _selected={{ color: "white", bg: "#1A70B8" }}
                  className="rounded-lg text-gray-700 bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Text className="text-nowrap">Awaiting Payout </Text>
                    {/* <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                {awaiting?.length}
              </p> */}
                  </div>
                </Tab>

                <Tab
                  _selected={{ color: "white", bg: "#1A70B8" }}
                  className="rounded-lg text-gray-700 bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Text className="text-nowrap">Completed Payout</Text>
                    {/* <p className="bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm">
                {completed?.length}
              </p> */}
                  </div>
                </Tab>

                <Tab
                  _selected={{ color: "white", bg: "#1A70B8" }}
                  className="rounded-lg text-gray-700 bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Text className="text-nowrap">Transaction History</Text>
                    {/* <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                {history?.length}
              </p> */}
                  </div>
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={0}>
                  <WalletTable
                    data={awaiting}
                    type="awaiting"
                    hasPagination={true}
                    metaData={metaData}
                    setPageCount={setPageCount}
                    isLoading={false}
                  />
                </TabPanel>

                <TabPanel px={0}>
                  <WalletTable
                    data={completed}
                    type="completed"
                    hasPagination={true}
                    metaData={metaData}
                    setPageCount={setPageCount}
                    isLoading={false}
                  />
                </TabPanel>

                <TabPanel px={0}>
                  <WalletTable
                    data={history}
                    type="history"
                    hasPagination={true}
                    metaData={metaData}
                    setPageCount={setPageCount}
                    isLoading={false}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
