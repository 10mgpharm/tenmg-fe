"use client";

import React, { useCallback, useEffect, useState } from "react";

import totalPattern from "@public/assets/images/bgPattern.svg";
import orderPattern from "@public/assets/images/orderPattern.svg";
import productPattern from "@public/assets/images/productpatterns.svg";
import SearchComponent from "../../suppliers/orders/_components/SearchComponent";
import DataTable from "./_components/DataTable";
import requestClient from "@/lib/requestClient";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import { useDebouncedValue } from "@/utils/debounce";
import WalletOverview from "../../admin/wallet/_components/WalletOverview";

const MyEarnings = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [overViewData, setOverViewData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const session = useSession();
  const sessionData = session?.data as NextAuthUserSession;
  const token = sessionData?.user?.token;
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const fetchStatData = useCallback(async () => {
    try {
      const response = await requestClient({ token: token }).get(
        "/lender/earnings/stats"
      );
      if (response.status === 200) {
        setOverViewData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);

    let query = `/lender/earnings?page=${pageCount}`;

    if (debouncedSearch) {
      query += `&search=${debouncedSearch}`;
    }

    try {
      const response = await requestClient({ token: token }).get(query);
      if (response.status === 200) {
        setTableData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [token, pageCount, debouncedSearch]);

  useEffect(() => {
    fetchTableData();
    fetchStatData();
  }, [fetchTableData, fetchStatData]);

  return (
    <div className="px-4">
      <h4 className="text-xl font-bold my-4">Earning by Loan</h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] md:gap-4 mt-5 c">
        <WalletOverview
          title="Total Projected Interest"
          value={`₦${overViewData?.data?.totalProjectedInterest ?? 0.0}`}
          fromColor="from-[#53389E]"
          toColor="to-[#7F56D9]"
          image={totalPattern}
          hasPendingBalance={false}
        />
        <WalletOverview
          title="Total Repaid Interest"
          value={`₦${overViewData?.data?.totalRepaidInterest ?? 0.0}`}
          fromColor="from-[#DC6803]"
          toColor="to-[#DC6803]"
          image={orderPattern}
          hasPendingBalance={false}
        />
        <WalletOverview
          title="Total Balance Interest"
          value={`₦${overViewData?.data?.totalBalanceInterest ?? 0.0}`}
          fromColor="from-[#E31B54]"
          toColor="to-[#E31B54]"
          image={productPattern}
          hasPendingBalance={false}
        />
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <SearchComponent
          placeholder="Search for a loan"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <DataTable
          data={tableData?.data}
          loading={isLoading}
          setPageCount={setPageCount}
        />
      </div>
    </div>
  );
};

export default MyEarnings;
