"use client";

import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import React, { useMemo, useState } from "react";
import { ArrowLeft, ListFilter } from "lucide-react";
import { Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
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
