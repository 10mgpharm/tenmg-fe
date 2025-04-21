"use client";

import { Button, Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { ArrowLeft, ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import OverviewCard from "../../../wallet/_components/OverviewCard";
import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { transactionData } from "@/data/mockdata";
import WalletTable from "../../_components/WalletTable";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import FilterDrawer from "@/app/(protected)/vendors/_components/FilterDrawer";
import { IFilterInput } from "@/app/(protected)/vendors/customers-management/page";
import Link from "next/link";
import Image from "next/image";

const Wallet = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const [selectedTimeLine, setSelectedTimeLine] = useState("12 months");
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagecount, setPageCount] = useState(1);
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
    { option: "AWAITING", value: "AWAITING" },
    { option: "COMPLETED", value: "COMPLETED" },
    { option: "PENDING", value: "PENDING" },
  ];

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
              <span className="bg-[#FFF1F3] text-[#C01048] font-medium text-[14px] ml-5 px-6 py-3 rounded-full">
                Supplier
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-7 c">
              <div
                className={`bg-gradient-to-r from-[#53389E] to-[#7F56D9] rounded-lg relative  pt-8 sm:pt-10  lg:pt-12 px-6`}
              >
                <div className="flex ">
                  <div className="">
                    <p className="text-white text-[15px] lg:text-lg font-medium mb-1">
                      {"Total Commission Earned"}
                    </p>
                    <p className="font-bold text-white text-[18px] sm:text-[20px] lg:text-3xl">
                      {"₦5,600"}
                    </p>
                  </div>
                </div>
                <p className="flex flex-col  pt-5 pb-5 text-white/70  text-[15px]">
                  Last payment date:
                  <span>2 march, 2025</span>
                </p>

                <div className="absolute top-3 inset-x-0 mx-auto">
                  <Image src={totalPattern} alt="" className="mx-auto" />
                </div>
              </div>

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

            <div className="flex items-center justify-between gap-3 pt-6 pb-4">
              <h3 className="font-semibold text-[18px]">Recent Transactions</h3>

              <Link href={`/admin/users/supplier-wallet/view-all/${params.id}`}>
                <Button variant={"outline"}>View all</Button>
              </Link>
            </div>

            <WalletTable
              data={history}
              hasPagination={false}
              metaData={metaData}
              setPageCount={setPageCount}
            />
          </div>
        )}
      </div>

      <FilterDrawer
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default Wallet;
