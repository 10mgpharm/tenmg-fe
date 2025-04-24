"use client";

import { Flex, Spinner, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { transactionData } from "@/data/mockdata";
import WalletTable from "../../_components/WalletTable";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import { cn } from "@/lib/utils";

const VendorWallet = ({
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
              <span className="bg-green-500/10 text-green-600 font-medium text-[14px] ml-5 px-6 py-2 rounded-full">
                Vendor
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-7 c">
              <div
                className={`bg-white border-gray-200 border-2 rounded-md p-5 flex items-center`}
              >
                <div className="flex-col flex gap-2">
                  <p className="text-gray-800 text-[15px] font-semibold ">
                    {" Ledger Account"}
                  </p>
                  <p className="font-bold text-[20px] ">{"₦5,600"}</p>
                </div>
              </div>

              <div
                className={`bg-white border-gray-200 border-2 rounded-md p-5 flex items-center `}
              >
                <div className="flex-col flex gap-2  ">
                  <p className="text-gray-800 text-[15px] font-semibold ">
                    {"Wallet Balance"}
                  </p>
                  <p className="font-bold text-[20px] ">{"₦2,300"}</p>
                </div>
              </div>

              <div
                className={`bg-white border-gray-200 border-2 rounded-md p-5`}
              >
                <div className="flex justify-end">
                  <select
                    className="bg-gray-200 rounded-full pl-3 outline-none ring-0 text-[13px] py-1 "
                    onChange={(e) => setAdminCommissionFilter(e.target.value)}
                    value={adminCommisionFilter}
                  >
                    <option value="10">Last 7 Days</option>
                    <option value="20">Last 14 Days</option>
                    <option value="delayed">1 Month Ago</option>
                    <option value="canceled">All Time</option>
                  </select>
                </div>

                <div className="flex-col flex gap-2 mt-2">
                  <p className="text-gray-800 text-[15px] font-semibold ">
                    {"Admin Commission"}
                  </p>
                  <p className="font-bold text-[20px] ">{"₦50,000"}</p>
                </div>
              </div>
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

export default VendorWallet;
