"use client";

import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import React, { useMemo, useState } from "react";
import OverviewCard from "../../../wallet/_components/OverviewCard";
import { ArrowLeft, ListFilter } from "lucide-react";
import { Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import { pharmTransactionHistoryData } from "@/data/mockdata";
import TransactionTable from "../../_components/transactionTable";
import FilterDrawer from "@/app/(protected)/vendors/_components/FilterDrawer";
import { IFilterInput } from "@/app/(protected)/vendors/customers-management/page";

type DataType = {
  id: string;
  date: string;
  description: string;
  amountPaid: number;
  paymentStatus: string;
};

const TransactionHistory = () => {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagecount, setPageCount] = useState(1);
  const [data, setData] = useState<DataType[]>([]);
  const [status, setStatus] = useState<string>("");
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

  const filterOptions = [
    { option: "SUCCESSFUL", value: "SUCCESSFUL" },
    { option: "PENDING", value: "PENDING" },
    { option: "FAILED", value: "FAILED" },
  ];

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

  const applyFilters = (filters: IFilterInput) => {
    console.log(
      filters,
      `&dateFrom=${filters.startDate.toISOString().split("T")[0]}`
    );
    setCreatedAtStart(filters.startDate);
    setCreatedAtEnd(filters.endDate);
    setStatus(filters.status);
  };

  const clearFilters = () => {
    setCreatedAtStart(null);
    setCreatedAtEnd(null);
    setStatus("");
    setGlobalFilter("");
  };

  useMemo(() => setData(pharmTransactionHistoryData), []);

  return (
    <div>
      <div className="p-5">
        {isLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <>
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
                Transaction History
              </h3>
              <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-4">
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

                <div className="flex items-center gap-2">
                  <SearchInput
                    placeholder="Search"
                    value={searchValue}
                    onChange={() => setSearchValue}
                  />

                  <button
                    className="border-gray-300 h-[43px]  border rounded-md px-3 cursor-pointer hover:bg-gray-100"
                    onClick={onOpenFilter}
                  >
                    <ListFilter className="text-[16px] " />
                  </button>
                </div>
              </div>

              <TransactionTable
                data={data}
                hasPagination
                metaData={metaData}
                setPageCount={setPageCount}
              />
            </div>

            <FilterDrawer
              isOpen={isOpenFilter}
              onClose={onCloseFilter}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              filterOptions={filterOptions}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
