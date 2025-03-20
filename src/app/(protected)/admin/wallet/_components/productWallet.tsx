import React from "react";
import OverviewCard from "./OverviewCard";
import {
  Flex,
  HStack,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import Link from "next/link";
import WalletTable from "./table";
import { transactionData } from "@/data/mockdata";

const ProductWallet = ({ filterDate }: { filterDate: string }) => {
  const awaiting = transactionData.filter((item) => item.type === "Awaiting");
  const completed = transactionData.filter((item) => item.type === "Completed");
  const history = transactionData.filter((item) => item.type === "History");

  return (
    <div>
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

      <HStack
        justify={"space-between"}
        mt={8}
        className="flex justify-between pb-2"
      >
        <Text fontSize={"xl"} fontWeight={"medium"} color={"gray.800"}>
          Transaction
        </Text>
        <Link
          className="py-2 px-4 rounded-md border text-sm font-medium text-gray-600 border-gray-300"
          href={"/admin/wallet/product-wallet"}
        >
          View all
        </Link>
      </HStack>

      <Tabs variant={"unstyled"}>
        <TabList className="flex flex-nowrap gap-4 overflow-x-scroll no-scrollbar  ">
          <Tab
            _selected={{ color: "white", bg: "#1A70B8" }}
            className="rounded-lg text-gray-700 bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Awaiting Payout</Text>
              <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                {awaiting?.length}
              </p>
            </div>
          </Tab>

          <Tab
            _selected={{ color: "white", bg: "#1A70B8" }}
            className="rounded-lg text-gray-700 bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Completed Payout</Text>
              <p className="bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm">
                {completed?.length}
              </p>
            </div>
          </Tab>

          <Tab
            _selected={{ color: "white", bg: "#1A70B8" }}
            className="rounded-lg text-gray-700 bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Text className="text-nowrap">Transaction History</Text>
              <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                {history?.length}
              </p>
            </div>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <WalletTable
              data={awaiting}
              type="awaiting"
              walletType="product_wallet"
            />
          </TabPanel>
          <TabPanel>
            <WalletTable
              data={completed}
              type="completed"
              walletType="product_wallet"
            />
          </TabPanel>
          <TabPanel>
            <WalletTable
              data={history}
              type="history"
              walletType="product_wallet"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ProductWallet;
