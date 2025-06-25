"use client";

import {
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { transactionData } from "@/data/mockdata";
import WalletTable from "../../_components/WalletTable";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import { cn } from "@/lib/utils";
import OverviewCard from "@/app/(protected)/suppliers/_components/OverviewCard/OverviewCard";
import UserWallet from "../../_components/WalletTable";
import { SupplierWalletTransactionColumn } from "../_component/TransactionColumn";
import { SupplierWallet_PendingPayout_Column } from "../_component/PendingPayoutColumn";
import SupplierWalletTransactionDetails from "../_component/transactionDetails";

const Wallet = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagecount, setPageCount] = useState(1);
  const [status, setStatus] = useState<string>("pending");
  const [openDetails, setOpenDetails] = useState(false);
  const [rowData, setRowData] = useState<any>(null);

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

  const openRowDetails = (data: any) => {
    setOpenDetails(true);
    setRowData(data);
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
              Onyejekwe Ugonna Wallet{" "}
              <span className="bg-[#FFF1F3] text-[#C01048] font-medium text-[14px] ml-5 px-6 py-2 rounded-full">
                Supplier
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-7 c">
              <OverviewCard
                fromColor="from-[#E31B54]"
                toColor="to-[#E31B54]"
                value="₦2,300"
                title="Total Pending Orders Amount"
              />

              <OverviewCard
                fromColor="from-[#53389E]"
                toColor="to-[#7F56D9]"
                value="₦5,600"
                title="Current Wallet Amount"
              />

              <OverviewCard
                fromColor="from-[#DC6803]"
                toColor="to-[#DC6803]"
                value="₦5,600"
                title="Transaction History"
              />
            </div>

            <Tabs variant={"unstyled"} className="w-full">
              {/* Tabs */}
              <div className="mt-8 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
                <TabList className="flex items-center gap-4">
                  <Tab
                    _selected={{
                      color: "white",
                      bg: "#1A70B8",
                    }}
                    className="text-[16px] font-medium text-gray-700 bg-gray-100 rounded-lg"
                  >
                    Pending Payout
                  </Tab>

                  <Tab
                    _selected={{
                      color: "white",
                      bg: "#1A70B8",
                    }}
                    className="text-[16px] font-medium text-gray-600 bg-gray-100 rounded-lg"
                  >
                    Transactions
                  </Tab>
                </TabList>

                <SearchInput
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>

              {/* panels */}
              <TabPanels className="mt-10 max-sm:mt-8">
                <TabPanel className="!p-0">
                  <UserWallet
                    data={awaiting}
                    hasPagination
                    metaData={metaData}
                    setPageCount={setPageCount}
                    isLoading={isLoading}
                    column={SupplierWallet_PendingPayout_Column(openRowDetails)}
                  />
                </TabPanel>
                <TabPanel className="!p-0">
                  <UserWallet
                    data={history}
                    hasPagination
                    metaData={metaData}
                    setPageCount={setPageCount}
                    isLoading={isLoading}
                    column={SupplierWalletTransactionColumn(openRowDetails)}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        )}
      </div>

      {openDetails && (
        <SupplierWalletTransactionDetails
          isOpen={openDetails}
          onClose={() => setOpenDetails(false)}
          data={rowData}
        />
      )}
    </div>
  );
};

export default Wallet;
