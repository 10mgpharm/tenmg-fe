"use client";

import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import React, { useState } from "react";
import OverviewCard from "../../../wallet/_components/OverviewCard";
import { ArrowLeft } from "lucide-react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";

const TransactionHistory = () => {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagecount, setPageCount] = useState(1);

  // random data
  const metaData = {
    links: "",
    prevPageUrl: "",
    nextPageUrl: "",
    currentPage: 1,
    firstPageUrl: "",
    lastPageUrl: "",
  };

  const card_info = [
    {
      title: "Total Deposits",
      value: "₦150,000,000",
      bgColor: "#53389E",
      bgImg: "/assets/images/disb_bg.png",
    },
    {
      title: "Total Withdrawals",
      value: "₦50,000,000",
      bgColor: "#DC6803",
      bgImg: "/assets/images/app_bg.png",
    },
    {
      title: "Net Wallet Balance",
      value: "₦2,500,000",
      bgColor: "#3E4784",
      bgImg: "/assets/images/pend_bg.png",
    },
    {
      title: "Last Transaction Date",
      value: "2024-12-7",
      bgColor: "#E31B54",
      bgImg: "/assets/images/tot_bg.png",
    },
  ];

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
            <h3 className="font-bold pt-3 text-[20px] ">Transaction History</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-5 c">
              {card_info.map((item, index) => (
                <div
                  key={index}
                  className="relative h-32 bg-cover bg-center bg-no-repeat rounded-lg p-4 flex items-center"
                  style={{
                    // backgroundColor: item.bgColor, // Apply solid color
                    backgroundImage: `url(${item.bgImg})`, // Apply background image
                    // backgroundBlendMode: "overlay", // Ensures color and image blend well
                  }}
                >
                  {/* Dark Overlay to Fade Background */}
                  <div
                    className="absolute inset-0  bg-opacity-10 rounded-md"
                    style={{ backgroundColor: item.bgColor }}
                  ></div>

                  {/* Card Content */}
                  <div className="relative z-10 text-white">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-base font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-6 pb-4">
              <h3 className="font-semibold text-[20px]">Transactions</h3>

              <SearchInput
                placeholder="Search"
                value={searchValue}
                onChange={() => setSearchValue}
              />
            </div>

            {/* <WalletTable
               data={history}
               hasPagination
               metaData={metaData}
               setPageCount={setPageCount}
             /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
