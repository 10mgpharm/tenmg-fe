"use client";

import { Flex, Spinner, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { transactionData } from "@/data/mockdata";
import WalletTable from "../../_components/WalletTable";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import { cn } from "@/lib/utils";
import OverviewCard from "@/app/(protected)/suppliers/_components/OverviewCard/OverviewCard";

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
  const [adminCommisionFilter, setAdminCommissionFilter] = useState("");

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

            <div className="flex items-center justify-between gap-3 pt-6 pb-4">
              <h3 className="font-semibold text-[18px]">Transactions</h3>

              <SearchInput
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-nowrap gap-4 overflow-x-scroll no-scrollbar  ">
                <div
                  className={cn(
                    "rounded-lg text-gray-700 cursor-pointer bg-gray-100 px-4 py-2",
                    status === "pending" && " text-white bg-[#1A70B8]"
                  )}
                  onClick={() => setStatus("pending")}
                >
                  <div className="flex items-center gap-3">
                    <Text className="text-nowrap">Awaiting Payout</Text>
                    <p className="bg-orange-50 text-orange-500 py-0.5 px-1.5 rounded-full text-sm">
                      {awaiting?.length}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-lg text-gray-700 cursor-pointer bg-gray-100 px-4 py-2",
                    status === "completed" && "text-white bg-[#1A70B8]"
                  )}
                  onClick={() => setStatus("completed")}
                >
                  <div className="flex items-center gap-3">
                    <Text className="text-nowrap">Completed Payout</Text>
                    <p className="bg-green-50 text-green-500 py-0.5 px-1.5 rounded-full text-sm">
                      {completed?.length}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-lg text-gray-700 cursor-pointer bg-gray-100 px-4 py-2",
                    status === "" && "text-white bg-[#1A70B8]"
                  )}
                  onClick={() => setStatus("")}
                >
                  <div className="flex items-center gap-3">
                    <Text className="text-nowrap">Transaction History</Text>
                    <p className="bg-purple-50 text-purple-500 py-0.5 px-1.5 rounded-full text-sm">
                      {history?.length}
                    </p>
                  </div>
                </div>
              </div>
              <WalletTable
                data={
                  status === "pending"
                    ? awaiting
                    : status === "completed"
                    ? completed
                    : history
                }
                hasPagination
                metaData={metaData}
                setPageCount={setPageCount}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
