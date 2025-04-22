"use client";

import React, { useState } from "react";

import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import OverviewCard from "../../admin/wallet/_components/OverviewCard";
import SearchComponent from "../../suppliers/orders/_components/SearchComponent";
import DataTable from "./_components/DataTable";
import { myEarningsData } from "@/data/mockdata";

const MyEarnings = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  return (
    <div className="px-4">
      <h4 className="text-xl font-bold my-4">Earning by Loan</h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-5 c">
        <OverviewCard
          title="Total Projected Interest"
          value="₦5,600"
          fromColor="from-[#53389E]"
          toColor="to-[#7F56D9]"
          image={totalPattern}
        />
        <OverviewCard
          title="Total Repaid Interest"
          value="₦2,300"
          fromColor="from-[#DC6803]"
          toColor="to-[#DC6803]"
          image={orderPattern}
        />
        <OverviewCard
          title="Total Balance Interest"
          value="₦50,000"
          fromColor="from-[#E31B54]"
          toColor="to-[#E31B54]"
          image={productPattern}
        />
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <SearchComponent
          placeholder="Search for a user"
          onChange={() => setSearchValue}
        />

        <DataTable
          data={myEarningsData}
          loading={isLoading}
          pageCount={pageCount}
          setPageCount={setPageCount}
        />
      </div>
    </div>
  );
};

export default MyEarnings;
