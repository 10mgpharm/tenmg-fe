"use client";

import FilterDrawer from "@/app/(protected)/vendors/_components/FilterDrawer";
import SearchInput from "@/app/(protected)/vendors/_components/SearchInput";
import { useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import WalletTable from "../../../_components/WalletTable";
import { ListFilter } from "lucide-react";
import { IFilterInput } from "@/app/(protected)/vendors/customers-management/page";
import { transactionData } from "@/data/mockdata";

const ViewAll = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [pagecount, setPageCount] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
  const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const history = transactionData.filter((item) => item.type === "History");

  const {
    isOpen: isOpenFilter,
    onClose: onCloseFilter,
    onOpen: onOpenFilter,
  } = useDisclosure();

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
    <>
      {" "}
      <div>
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

        <WalletTable
          data={history}
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
        // filterOptions={filterOptions}
      />
    </>
  );
};

export default ViewAll;
